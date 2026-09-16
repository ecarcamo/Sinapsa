package services

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math/big"
)

func GenerateOTP() (string, error) {
	// 6 dígitos, crypto secure
	n, err := rand.Int(rand.Reader, big.NewInt(900000))
	if err != nil {
		return "", err
	}
	code := n.Int64() + 100000
	return fmt.Sprintf("%06d", code), nil
}

func HashOTP(code string) string {
	h := sha256.Sum256([]byte(code))
	return hex.EncodeToString(h[:])
}
