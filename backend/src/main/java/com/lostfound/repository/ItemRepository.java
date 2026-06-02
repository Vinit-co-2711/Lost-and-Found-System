package com.lostfound.repository;

import com.lostfound.model.Item;
import com.lostfound.model.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    // Custom finder method using the indexed status column
    List<Item> findByStatus(ItemStatus status);
}
