package com.poly.datn.entity;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;

@Entity
@Table(name = "cart_detail")
public class CartDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "create_date")
    @CreationTimestamp
    private Instant createDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @Formula("(select sum(d.quantity * v.price) from cart_detail d join product_variant v on v.id = d.product_variant_id  where v.id = product_variant_id and d.id = id)")
    private Double price_detail;

    @Transient
    private Double discount_amount;

    public Double getDiscount_Amount() {
        try {
            Double price = productVariant.getPrice();
            PromotionProduct promotionProduct = productVariant.getProduct().getPromotion();
            if (promotionProduct == null || (promotionProduct.getActivate() == null || !promotionProduct.getActivate()))
                return 0.0;

            LocalDateTime today = LocalDateTime.now();
            ZoneId zoneId = ZoneId.of("Asia/Ho_Chi_Minh"); 
            ZoneOffset offset = OffsetDateTime.ofInstant(Instant.now(), zoneId).getOffset();   
            Instant now = today.toInstant(offset);

            Boolean hasExpireDate =  promotionProduct.getExpirationDate() != null;  
            Boolean hasStartDate = promotionProduct.getUpdatedDate() != null;

            Boolean isStarted = promotionProduct.getUpdatedDate().isBefore(now) || promotionProduct.getUpdatedDate().equals(now);

            if (hasExpireDate && now.isAfter(promotionProduct.getExpirationDate())) {
               return 0.0;
            } 

            if(hasStartDate && !isStarted) return 0.0;

            if (promotionProduct.getIsPercent()) {
                Integer per = promotionProduct.getDiscountAmount().intValue();
                return price * (per * 0.01);
            } else {
                return  promotionProduct.getDiscountAmount();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Double getPrice_Detail() {
        return price_detail;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Instant getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Instant createDate) {
        this.createDate = createDate;
    }

    public ProductVariant getProductVariant() {
        return productVariant;
    }

    public void setProductVariant(ProductVariant productVariant) {
        this.productVariant = productVariant;
    }

}