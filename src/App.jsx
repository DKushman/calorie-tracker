import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Tagesziel für Makros
  const DAILY_GOALS = {
    calories: 2500,
    protein: 150,
    carbs: 300,
    fat: 80
  }

  // State Management
  const [meals, setMeals] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [quickCalories, setQuickCalories] = useState(0)
  
  // Meal Form State
  const [mealForm, setMealForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    image: null,
    imagePreview: null,
    time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  })

  // Load from localStorage
  useEffect(() => {
    const savedMeals = localStorage.getItem('calorieTrackerMeals')
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('calorieTrackerMeals', JSON.stringify(meals))
  }, [meals])

  // Berechne konsumierte Makros
  const consumed = meals.reduce((acc, meal) => ({
    calories: acc.calories + Number(meal.calories),
    protein: acc.protein + Number(meal.protein),
    carbs: acc.carbs + Number(meal.carbs),
    fat: acc.fat + Number(meal.fat)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  // Berechne übrige Makros
  const remaining = {
    calories: DAILY_GOALS.calories - consumed.calories,
    protein: DAILY_GOALS.protein - consumed.protein,
    carbs: DAILY_GOALS.carbs - consumed.carbs,
    fat: DAILY_GOALS.fat - consumed.fat
  }

  // Berechne Prozentsätze für Progress Circles
  const percentages = {
    calories: (consumed.calories / DAILY_GOALS.calories) * 100,
    protein: (consumed.protein / DAILY_GOALS.protein) * 100,
    carbs: (consumed.carbs / DAILY_GOALS.carbs) * 100,
    fat: (consumed.fat / DAILY_GOALS.fat) * 100
  }

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMealForm(prev => ({
          ...prev,
          image: reader.result,
          imagePreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Add Meal
  const handleAddMeal = (e) => {
    e.preventDefault()
    const newMeal = {
      id: Date.now(),
      name: mealForm.name,
      calories: Number(mealForm.calories),
      protein: Number(mealForm.protein),
      carbs: Number(mealForm.carbs),
      fat: Number(mealForm.fat),
      image: mealForm.image,
      time: mealForm.time
    }
    
    setMeals(prev => [newMeal, ...prev])
    setShowAddModal(false)
    resetForm()
  }

  // Handle Quick Add
  const handleQuickAdd = () => {
    if (quickCalories > 0) {
      const newMeal = {
        id: Date.now(),
        name: 'Quick Add',
        calories: quickCalories,
        protein: 0,
        carbs: 0,
        fat: 0,
        image: null,
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      }
      setMeals(prev => [newMeal, ...prev])
      setShowQuickAdd(false)
      setQuickCalories(0)
    }
  }

  // Reset Form
  const resetForm = () => {
    setMealForm({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      image: null,
      imagePreview: null,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    })
  }

  // Delete Meal
  const deleteMeal = (id) => {
    setMeals(prev => prev.filter(meal => meal.id !== id))
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <button className="back-button">←</button>
        <h1 className="date-title">
          {new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })}
        </h1>
        <button className="add-button" onClick={() => setShowAddModal(true)}>+</button>
      </header>

      {/* Main Calories Card */}
      <div className="main-card">
        <div className="calories-info">
          <h2 className="calories-number">{remaining.calories}</h2>
          <p className="calories-label">Calories left</p>
        </div>
        <div className="main-progress">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="12"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#000"
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - percentages.calories / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className="flame-icon">🔥</div>
        </div>
      </div>

      {/* Macro Cards */}
      <div className="macro-cards">
        <div className="macro-card">
          <h3 className="macro-number">{remaining.protein}g</h3>
          <p className="macro-label">Protein left</p>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ff6b6b"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentages.protein / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="macro-icon">🍗</div>
        </div>

        <div className="macro-card">
          <h3 className="macro-number">{remaining.carbs}g</h3>
          <p className="macro-label">Carbs left</p>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ffa500"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentages.carbs / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="macro-icon">🌾</div>
        </div>

        <div className="macro-card">
          <h3 className="macro-number">{remaining.fat}g</h3>
          <p className="macro-label">Fat left</p>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#4a90e2"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentages.fat / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="macro-icon">🥑</div>
        </div>
      </div>

      {/* Quick Add Button */}
      <button className="quick-add-btn" onClick={() => setShowQuickAdd(true)}>
        ⚡ Schnell hinzufügen
      </button>

      {/* Recently Logged Section */}
      <div className="recently-logged">
        <h2 className="section-title">Recently logged</h2>
        {meals.length === 0 ? (
          <p className="empty-state">Noch keine Mahlzeiten geloggt</p>
        ) : (
          <div className="meals-list">
            {meals.map(meal => (
              <div key={meal.id} className="meal-item">
                <div className="meal-image">
                  {meal.image ? (
                    <img src={meal.image} alt={meal.name} />
                  ) : (
                    <div className="meal-image-placeholder">🍽️</div>
                  )}
                </div>
                <div className="meal-info">
                  <div className="meal-header">
                    <h3 className="meal-name">{meal.name}</h3>
                    <span className="meal-time">{meal.time}</span>
                  </div>
                  <p className="meal-calories">🔥 {meal.calories} calories</p>
                  <div className="meal-macros">
                    <span>🍗 {meal.protein}g</span>
                    <span>🌾 {meal.carbs}g</span>
                    <span>🥑 {meal.fat}g</span>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => deleteMeal(meal.id)}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Mahlzeit hinzufügen</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddMeal}>
              <div className="form-group">
                <label>Bild hochladen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {mealForm.imagePreview && (
                  <div className="image-preview">
                    <img src={mealForm.imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Name der Mahlzeit *</label>
                <input
                  type="text"
                  value={mealForm.name}
                  onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                  required
                  placeholder="z.B. Vegetable Salad"
                />
              </div>

              <div className="form-group">
                <label>Kalorien *</label>
                <input
                  type="number"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                  required
                  min="0"
                  placeholder="250"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Protein (g) *</label>
                  <input
                    type="number"
                    value={mealForm.protein}
                    onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
                    required
                    min="0"
                    placeholder="20"
                  />
                </div>

                <div className="form-group">
                  <label>Kohlenhydrate (g) *</label>
                  <input
                    type="number"
                    value={mealForm.carbs}
                    onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
                    required
                    min="0"
                    placeholder="30"
                  />
                </div>

                <div className="form-group">
                  <label>Fett (g) *</label>
                  <input
                    type="number"
                    value={mealForm.fat}
                    onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })}
                    required
                    min="0"
                    placeholder="10"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">Hinzufügen</button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="modal-overlay" onClick={() => setShowQuickAdd(false)}>
          <div className="modal quick-add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schnell hinzufügen</h2>
              <button className="close-btn" onClick={() => setShowQuickAdd(false)}>×</button>
            </div>
            <div className="quick-add-content">
              <div className="calories-display">
                <h1>{quickCalories}</h1>
                <p>Kalorien</p>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={quickCalories}
                onChange={(e) => setQuickCalories(Number(e.target.value))}
                className="calorie-slider"
              />
              <div className="slider-labels">
                <span>0</span>
                <span>500</span>
                <span>1000</span>
              </div>
              <button 
                className="submit-btn" 
                onClick={handleQuickAdd}
                disabled={quickCalories === 0}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

