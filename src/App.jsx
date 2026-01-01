import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // State Management
  const [meals, setMeals] = useState([])
  const [dailyGoal, setDailyGoal] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
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

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // Load from localStorage
  useEffect(() => {
    const savedMeals = localStorage.getItem('calorieTrackerMeals')
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals))
    }
    const savedGoal = localStorage.getItem('calorieTrackerGoal')
    if (savedGoal) {
      setDailyGoal(Number(savedGoal))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('calorieTrackerMeals', JSON.stringify(meals))
  }, [meals])

  useEffect(() => {
    if (dailyGoal !== null) {
      localStorage.setItem('calorieTrackerGoal', dailyGoal.toString())
    }
  }, [dailyGoal])

  // Get meals for selected date
  const selectedDateStr = formatDate(selectedDate)
  const dayMeals = meals.filter(meal => meal.date === selectedDateStr)

  // Berechne konsumierte Makros für ausgewählten Tag
  const consumed = dayMeals.reduce((acc, meal) => ({
    calories: acc.calories + Number(meal.calories),
    protein: acc.protein + Number(meal.protein),
    carbs: acc.carbs + Number(meal.carbs),
    fat: acc.fat + Number(meal.fat)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  // Berechne übrige Makros
  const remaining = {
    calories: dailyGoal ? dailyGoal - consumed.calories : 0,
    protein: consumed.protein,
    carbs: consumed.carbs,
    fat: consumed.fat
  }

  // Berechne Prozentsätze für Progress Circles
  const percentages = {
    calories: dailyGoal ? (consumed.calories / dailyGoal) * 100 : 0,
    protein: 0,
    carbs: 0,
    fat: 0
  }

  // Get all unique dates with meals
  const getDatesWithMeals = () => {
    const dates = [...new Set(meals.map(meal => meal.date))]
    return dates.sort().reverse()
  }

  // Get total calories for a date
  const getDateCalories = (dateStr) => {
    return meals
      .filter(meal => meal.date === dateStr)
      .reduce((sum, meal) => sum + Number(meal.calories), 0)
  }

  // Check if date is over/under goal
  const getDateStatus = (dateStr) => {
    if (!dailyGoal) return null
    const total = getDateCalories(dateStr)
    return total > dailyGoal ? 'over' : 'under'
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
      protein: Number(mealForm.protein) || 0,
      carbs: Number(mealForm.carbs) || 0,
      fat: Number(mealForm.fat) || 0,
      image: mealForm.image,
      time: mealForm.time,
      date: selectedDateStr
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
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        date: selectedDateStr
      }
      setMeals(prev => [newMeal, ...prev])
      setShowQuickAdd(false)
      setQuickCalories(0)
    }
  }

  // Handle Settings Save
  const handleSaveGoal = (e) => {
    e.preventDefault()
    const goal = Number(e.target.goal.value)
    if (goal > 0) {
      setDailyGoal(goal)
      setShowSettings(false)
    }
  }

  // Calendar navigation
  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + direction)
    setSelectedDate(newDate)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const today = new Date()
    const days = []
    const datesWithMeals = getDatesWithMeals()
    
    // Get last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = formatDate(date)
      const calories = getDateCalories(dateStr)
      const status = getDateStatus(dateStr)
      
      days.push({
        date,
        dateStr,
        calories,
        status,
        isToday: formatDate(date) === formatDate(today),
        isSelected: formatDate(date) === selectedDateStr
      })
    }
    
    return days
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
        <button className="nav-button" onClick={() => navigateDate(-1)}>←</button>
        <div className="date-section">
          <button className="calendar-icon-btn" onClick={() => setShowCalendar(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 8h14M7 3v5M13 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <h1 className="date-title">
            {selectedDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })}
          </h1>
        </div>
        <button className="add-button" onClick={() => setShowAddModal(true)}>+</button>
      </header>

      {/* Settings Prompt if no goal set */}
      {!dailyGoal && (
        <div className="settings-prompt">
          <p>Bitte setze dein tägliches Kalorienziel</p>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            Ziel setzen
          </button>
        </div>
      )}

      {/* Main Calories Card */}
      {dailyGoal && (
        <div className="main-card">
          <div className="calories-info">
            <h2 className="calories-number">{remaining.calories >= 0 ? remaining.calories : 0}</h2>
            <p className="calories-label">Calories left</p>
            <button className="settings-link" onClick={() => setShowSettings(true)}>
              Ziel: {dailyGoal} kcal
            </button>
          </div>
          <div className="main-progress">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="10"
              />
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke={consumed.calories > dailyGoal ? "#ff3b30" : "#34c759"}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - Math.min(percentages.calories / 100, 1))}`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="calories-center">
              <span className="calories-consumed">{consumed.calories}</span>
              <span className="calories-slash">/</span>
              <span className="calories-goal">{dailyGoal}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Button */}
      <button className="quick-add-btn" onClick={() => setShowQuickAdd(true)}>
        Schnell hinzufügen
      </button>

      {/* Recently Logged Section */}
      <div className="recently-logged">
        <h2 className="section-title">Geloggte Mahlzeiten</h2>
        {dayMeals.length === 0 ? (
          <p className="empty-state">Noch keine Mahlzeiten für diesen Tag geloggt</p>
        ) : (
          <div className="meals-list">
            {dayMeals.map(meal => (
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
                  <p className="meal-calories">{meal.calories} kcal</p>
                  {(meal.protein > 0 || meal.carbs > 0 || meal.fat > 0) && (
                    <div className="meal-macros">
                      {meal.protein > 0 && <span>P: {meal.protein}g</span>}
                      {meal.carbs > 0 && <span>K: {meal.carbs}g</span>}
                      {meal.fat > 0 && <span>F: {meal.fat}g</span>}
                    </div>
                  )}
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
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    value={mealForm.protein}
                    onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Kohlenhydrate (g)</label>
                  <input
                    type="number"
                    value={mealForm.carbs}
                    onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Fett (g)</label>
                  <input
                    type="number"
                    value={mealForm.fat}
                    onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })}
                    min="0"
                    placeholder="0"
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tägliches Kalorienziel</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
            </div>
            <form onSubmit={handleSaveGoal}>
              <div className="form-group">
                <label>Kalorien pro Tag</label>
                <input
                  type="number"
                  name="goal"
                  defaultValue={dailyGoal || ''}
                  required
                  min="1"
                  placeholder="z.B. 2500"
                  className="goal-input"
                />
              </div>
              <button type="submit" className="submit-btn">Speichern</button>
            </form>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
          <div className="modal calendar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Kalender</h2>
              <button className="close-btn" onClick={() => setShowCalendar(false)}>×</button>
            </div>
            <div className="calendar-grid">
              {generateCalendarDays().map((day, idx) => (
                <button
                  key={idx}
                  className={`calendar-day ${day.isSelected ? 'selected' : ''} ${day.status || ''}`}
                  onClick={() => {
                    setSelectedDate(day.date)
                    setShowCalendar(false)
                  }}
                >
                  <span className="day-number">{day.date.getDate()}</span>
                  {day.calories > 0 && (
                    <span className={`day-calories ${day.status}`}>
                      {day.calories}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

