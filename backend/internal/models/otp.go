package models

import (
	"time"
)

type OTPCode struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	Email     string     `gorm:"index;size:255;not null" json:"email"`
	CodeHash  string     `gorm:"size:255;not null" json:"-"`
	ExpiresAt time.Time  `gorm:"not null" json:"expiresAt"`
	Attempts  int        `gorm:"default:0" json:"attempts"`
	UsedAt    *time.Time `json:"usedAt,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

func (o OTPCode) IsExpired() bool {
	return time.Now().After(o.ExpiresAt)
}

func (o OTPCode) IsUsed() bool {
	return o.UsedAt != nil
}
