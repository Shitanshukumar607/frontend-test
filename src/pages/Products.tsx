import { useState, useEffect } from 'react'
import './Products.css'

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  images: string[];
  thumbnail: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('default')
  
  // Detailed Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!apiUrl) {
      setError('Environment variable VITE_API_URL is missing or undefined. Please add it to your .env file.')
      setLoading(false)
      return
    }

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText} (${response.status})`)
        }
        const data = await response.json()
        if (data && Array.isArray(data.products)) {
          setProducts(data.products)
        } else if (Array.isArray(data)) {
          setProducts(data)
        } else {
          throw new Error('API returned data in an unexpected format.')
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching products.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [apiUrl])

  // Get unique categories for filtering
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0 // default
    })

  // Helper to render stars
  const renderStars = (rating: number) => {
    const stars = []
    const floorRating = Math.floor(rating)
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<span key={i} className="star-icon filled">★</span>)
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="star-icon half">★</span>)
      } else {
        stars.push(<span key={i} className="star-icon empty">☆</span>)
      }
    }
    return stars
  }

  return (
    <div className="products-container">
      <header className="products-header">
        <h1 className="products-title">Premium Catalog</h1>
        <p className="products-subtitle">
          Explore our collection of handpicked, high-quality items fetched in real-time.
        </p>
        <div className="api-badge">
          <span className="api-badge-dot"></span>
          <span className="api-badge-text">Source: <code>{apiUrl}</code></span>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <section className="controls-section">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search products, brands, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search products"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')} aria-label="Clear search">×</button>
          )}
        </div>

        <div className="filter-group">
          <div className="select-wrapper">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="control-select"
              aria-label="Filter by Category"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="control-select"
              aria-label="Sort products"
            >
              <option value="default">Default Sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* Dynamic State Rendering */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching curated collection...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="minimal-btn primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No products found</h3>
          <p>Try adjusting your search keywords or category filters.</p>
          <button 
            className="minimal-btn secondary"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSortBy('default')
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => {
            const hasDiscount = product.discountPercentage && product.discountPercentage > 0
            const discountedPrice = hasDiscount 
              ? (product.price * (1 - product.discountPercentage! / 100)).toFixed(2)
              : null

            return (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => setSelectedProduct(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedProduct(product); }}
              >
                <div className="card-image-wrapper">
                  <img 
                    src={product.thumbnail || product.images[0]} 
                    alt={product.title} 
                    className="card-image"
                    loading="lazy"
                  />
                  <span className="category-badge">{product.category}</span>
                  {hasDiscount && (
                    <span className="discount-badge">-{Math.round(product.discountPercentage!)}% Off</span>
                  )}
                </div>

                <div className="card-content">
                  {product.brand && <span className="product-brand">{product.brand}</span>}
                  <h3 className="product-card-title">{product.title}</h3>
                  
                  <div className="rating-row">
                    <div className="stars-wrapper">
                      {renderStars(product.rating)}
                    </div>
                    <span className="rating-number">{product.rating.toFixed(1)}</span>
                  </div>

                  <p className="product-card-desc">{product.description}</p>
                  
                  <div className="card-footer">
                    <div className="price-stack">
                      {discountedPrice ? (
                        <>
                          <span className="current-price">${discountedPrice}</span>
                          <span className="original-price">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="current-price">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <button className="view-details-btn" aria-label={`View details of ${product.title}`}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detailed Product Modal */}
      {selectedProduct && (
        <div 
          className="modal-backdrop"
          onClick={() => setSelectedProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedProduct(null)}
              aria-label="Close details"
            >
              &times;
            </button>

            <div className="modal-body">
              {/* Product Gallery & Visuals */}
              <div className="modal-gallery">
                <div className="modal-main-image-container">
                  <img 
                    src={selectedProduct.images[0] || selectedProduct.thumbnail} 
                    alt={selectedProduct.title}
                    className="modal-main-image"
                  />
                </div>
                {selectedProduct.images.length > 1 && (
                  <div className="modal-thumbnails">
                    {selectedProduct.images.slice(0, 4).map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt={`${selectedProduct.title} view ${idx + 1}`} 
                        className="modal-thumb"
                        onClick={(e) => {
                          const mainImg = e.currentTarget.closest('.modal-body')?.querySelector('.modal-main-image') as HTMLImageElement
                          if (mainImg) mainImg.src = img
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Specs */}
              <div className="modal-info">
                <div className="modal-header-info">
                  <span className="modal-category">{selectedProduct.category}</span>
                  <h2 className="modal-title-text">{selectedProduct.title}</h2>
                  {selectedProduct.brand && <p className="modal-brand">Brand: <strong>{selectedProduct.brand}</strong></p>}
                  
                  <div className="modal-rating-row">
                    <div className="stars-wrapper">
                      {renderStars(selectedProduct.rating)}
                    </div>
                    <span className="rating-number">{selectedProduct.rating.toFixed(2)} / 5</span>
                  </div>
                </div>

                <p className="modal-description">{selectedProduct.description}</p>

                <div className="modal-pricing-row">
                  <div className="modal-price">
                    {selectedProduct.discountPercentage && selectedProduct.discountPercentage > 0 ? (
                      <>
                        <span className="modal-current-price">
                          ${(selectedProduct.price * (1 - selectedProduct.discountPercentage / 100)).toFixed(2)}
                        </span>
                        <span className="modal-original-price">${selectedProduct.price.toFixed(2)}</span>
                        <span className="modal-discount-text">Save {Math.round(selectedProduct.discountPercentage)}%</span>
                      </>
                    ) : (
                      <span className="modal-current-price">${selectedProduct.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className={`stock-badge ${selectedProduct.stock > 5 ? 'in-stock' : 'low-stock'}`}>
                    {selectedProduct.stock > 5 ? `In Stock (${selectedProduct.stock})` : `Low Stock (Only ${selectedProduct.stock} left!)`}
                  </div>
                </div>

                {/* Technical Specifications Grid */}
                <div className="modal-specs">
                  <h3>Product Specifications</h3>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">SKU</span>
                      <span className="spec-value">{selectedProduct.sku || 'N/A'}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Warranty</span>
                      <span className="spec-value">{selectedProduct.warrantyInformation || 'N/A'}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Shipping</span>
                      <span className="spec-value">{selectedProduct.shippingInformation || 'N/A'}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Return Policy</span>
                      <span className="spec-value">{selectedProduct.returnPolicy || 'N/A'}</span>
                    </div>
                    {selectedProduct.dimensions && (
                      <div className="spec-item full-width">
                        <span className="spec-label">Dimensions (W × H × D)</span>
                        <span className="spec-value">
                          {selectedProduct.dimensions.width}cm × {selectedProduct.dimensions.height}cm × {selectedProduct.dimensions.depth}cm
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews Section */}
                {selectedProduct.reviews && selectedProduct.reviews.length > 0 && (
                  <div className="modal-reviews-section">
                    <h3>Customer Reviews</h3>
                    <div className="reviews-list">
                      {selectedProduct.reviews.map((review, rIdx) => (
                        <div key={rIdx} className="review-card">
                          <div className="review-header">
                            <span className="reviewer-name">{review.reviewerName}</span>
                            <span className="review-date">{new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                          <p className="review-comment">"{review.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
