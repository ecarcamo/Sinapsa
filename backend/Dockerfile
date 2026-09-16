# ==========================================
# Etapa 1: Build del binario en Go
# ==========================================
FROM golang:1.25-alpine AS builder

WORKDIR /app

RUN apk add --no-cache ca-certificates git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compilación estática optimizada para producción
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o /app/server ./cmd/server

# ==========================================
# Etapa 2: Imagen mínima de producción
# ==========================================
FROM alpine:3.20

WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

# Usuario sin privilegios por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/server /app/server

USER appuser

EXPOSE 8080

CMD ["/app/server"]
