package models

import (
	"time"
)

type User struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	Email     string     `gorm:"uniqueIndex;size:255;not null" json:"email"`
	Role      string     `gorm:"size:20;default:'user'" json:"role"` // admin | user
	IsActive  bool       `gorm:"default:true" json:"isActive"`
	InvitedAt *time.Time `json:"invitedAt,omitempty"`
	InvitedBy *uint      `json:"invitedBy,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

func (u User) IsAdmin() bool { return u.Role == "admin" }
