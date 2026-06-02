package com.lostfound.service;

import com.lostfound.model.Item;
import com.lostfound.model.ItemStatus;
import com.lostfound.model.User;

import java.util.List;

public interface ItemService {
    Item createItem(Item item, User reporter);
    List<Item> getAllItems();
    List<Item> getItemsByStatus(ItemStatus status);
    Item updateItemStatus(Long id, ItemStatus status, User updater);
    Item getItemById(Long id);
}
