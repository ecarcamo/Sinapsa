package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"sinapsa/backend/internal/database"
	"sinapsa/backend/internal/models"
)

type ItemHandler struct {
	db *database.Database
}

func NewItemHandler(db *database.Database) *ItemHandler {
	return &ItemHandler{db: db}
}

// ListItems returns all items from database
func (h *ItemHandler) ListItems(w http.ResponseWriter, r *http.Request) {
	var items []models.Item
	if err := h.db.DB.Order("id desc").Find(&items).Error; err != nil {
		http.Error(w, `{"error":"Error retrieving items"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

// CreateItem inserts a new item into database
func (h *ItemHandler) CreateItem(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Status      string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, `{"error":"Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	if input.Title == "" {
		http.Error(w, `{"error":"Title is required"}`, http.StatusBadRequest)
		return
	}

	if input.Status == "" {
		input.Status = "active"
	}

	item := models.Item{
		Title:       input.Title,
		Description: input.Description,
		Status:      input.Status,
	}

	if err := h.db.DB.Create(&item).Error; err != nil {
		http.Error(w, `{"error":"Error creating item in database"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(item)
}

// DeleteItem removes an item by ID
func (h *ItemHandler) DeleteItem(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, `{"error":"Invalid ID parameter"}`, http.StatusBadRequest)
		return
	}

	result := h.db.DB.Delete(&models.Item{}, id)
	if result.Error != nil {
		http.Error(w, `{"error":"Error deleting item"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected == 0 {
		http.Error(w, `{"error":"Item not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message":"Item deleted successfully"}`))
}
