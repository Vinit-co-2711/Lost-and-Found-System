package com.lostfound.controller;

import com.lostfound.model.Item;
import com.lostfound.model.ItemStatus;
import com.lostfound.model.Role;
import com.lostfound.model.User;
import com.lostfound.repository.UserRepository;
import com.lostfound.security.CustomUserDetails;
import com.lostfound.service.FileStorageService;
import com.lostfound.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    @Autowired
    public ItemController(ItemService itemService, FileStorageService fileStorageService, UserRepository userRepository) {
        this.itemService = itemService;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
    }

    /**
     * GET /api/items : Fetch all items or filter by status. Accessible to all authenticated users.
     */
    @GetMapping
    public ResponseEntity<List<Item>> getItems(@RequestParam(required = false) ItemStatus status) {
        if (status != null) {
            return ResponseEntity.ok(itemService.getItemsByStatus(status));
        }
        return ResponseEntity.ok(itemService.getAllItems());
    }

    /**
     * POST /api/items : Log a new item. Accepts combined JSON block and optional picture.
     * - CUSTOMER role can only log 'LOST' status.
     * - STAFF/ADMIN can log both 'LOST' and 'FOUND'.
     */
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createItem(
            @RequestPart("item") Item item,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        try {
            // Get active authenticated user context details
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            
            // Reload user from database to ensure fresh state
            User currentUser = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Authenticated user profile not found"));

            // Role validations
            if (currentUser.getRole() == Role.CUSTOMER) {
                if (item.getStatus() != ItemStatus.LOST) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Customers are only authorized to log reports with LOST status.");
                }
            }

            // Secure file write
            if (file != null && !file.isEmpty()) {
                String savedPath = fileStorageService.storeFile(file);
                // Save path to DB, e.g. "uploads/xyz.jpg"
                item.setImagePath(savedPath);
            }

            Item savedItem = itemService.createItem(item, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data parameters: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to log report: " + e.getMessage());
        }
    }

    /**
     * PUT /api/items/{id}/status : Restricted to STAFF and ADMIN to update statuses (e.g. to CLAIMED)
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest updateRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User currentUser = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Authenticated user profile not found"));

            ItemStatus newStatus = ItemStatus.valueOf(updateRequest.getStatus().toUpperCase());
            Item updatedItem = itemService.updateItemStatus(id, newStatus, currentUser);
            
            return ResponseEntity.ok(updatedItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // JSON DTO for updating status
    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
