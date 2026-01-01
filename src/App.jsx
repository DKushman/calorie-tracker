import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // State Management
  const [meals, setMeals] = useState([])
  const [dailyGoal, setDailyGoal] = useState(null)
  const [proteinGoal, setProteinGoal] = useState(null)
  const [carbsGoal, setCarbsGoal] = useState(null)
  const [fatGoal, setFatGoal] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [quickCalories, setQuickCalories] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  
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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedMeals = localStorage.getItem('calorieTrackerMeals')
      if (savedMeals) {
        try {
          const parsedMeals = JSON.parse(savedMeals)
          if (Array.isArray(parsedMeals)) {
            setMeals(parsedMeals)
            console.log('Loaded meals from localStorage:', parsedMeals.length)
          }
        } catch (parseError) {
          console.error('Error parsing meals from localStorage:', parseError)
        }
      }
      
      const savedGoal = localStorage.getItem('calorieTrackerGoal')
      if (savedGoal && savedGoal !== 'null') {
        const goalNum = Number(savedGoal)
        if (!isNaN(goalNum) && goalNum > 0) {
          setDailyGoal(goalNum)
        }
      }
      
      const savedProtein = localStorage.getItem('calorieTrackerProteinGoal')
      if (savedProtein && savedProtein !== 'null') {
        const proteinNum = Number(savedProtein)
        if (!isNaN(proteinNum) && proteinNum > 0) {
          setProteinGoal(proteinNum)
        }
      }
      
      const savedCarbs = localStorage.getItem('calorieTrackerCarbsGoal')
      if (savedCarbs && savedCarbs !== 'null') {
        const carbsNum = Number(savedCarbs)
        if (!isNaN(carbsNum) && carbsNum > 0) {
          setCarbsGoal(carbsNum)
        }
      }
      
      const savedFat = localStorage.getItem('calorieTrackerFatGoal')
      if (savedFat && savedFat !== 'null') {
        const fatNum = Number(savedFat)
        if (!isNaN(fatNum) && fatNum > 0) {
          setFatGoal(fatNum)
        }
      }
      
      const savedDate = localStorage.getItem('calorieTrackerSelectedDate')
      if (savedDate) {
        const date = new Date(savedDate)
        if (!isNaN(date.getTime())) {
          setSelectedDate(date)
        }
      }
      
      setIsInitialized(true)
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      setIsInitialized(true)
    }
  }, [])

  // Save to localStorage - save immediately when meals change
  useEffect(() => {
    if (!isInitialized) return // Don't save until data is loaded
    
    try {
      const mealsJson = JSON.stringify(meals)
      localStorage.setItem('calorieTrackerMeals', mealsJson)
      console.log('✅ Meals saved:', meals.length, 'items')
    } catch (error) {
      console.error('Error saving meals to localStorage:', error)
      // If storage is full, try to compress or remove old data
      if (error.name === 'QuotaExceededError') {
        alert('Speicher voll! Bitte lösche einige alte Mahlzeiten.')
      }
    }
  }, [meals, isInitialized])

  useEffect(() => {
    if (!isInitialized) return // Don't save until data is loaded
    
    if (dailyGoal !== null) {
      try {
        localStorage.setItem('calorieTrackerGoal', dailyGoal.toString())
        console.log('✅ Daily goal saved:', dailyGoal)
      } catch (error) {
        console.error('Error saving goal to localStorage:', error)
      }
    }
  }, [dailyGoal, isInitialized])

  useEffect(() => {
    if (!isInitialized) return // Don't save until data is loaded
    
    if (proteinGoal !== null) {
      try {
        localStorage.setItem('calorieTrackerProteinGoal', proteinGoal.toString())
        console.log('✅ Protein goal saved:', proteinGoal)
      } catch (error) {
        console.error('Error saving protein goal to localStorage:', error)
      }
    }
  }, [proteinGoal, isInitialized])

  useEffect(() => {
    if (!isInitialized) return // Don't save until data is loaded
    
    if (carbsGoal !== null) {
      try {
        localStorage.setItem('calorieTrackerCarbsGoal', carbsGoal.toString())
        console.log('✅ Carbs goal saved:', carbsGoal)
      } catch (error) {
        console.error('Error saving carbs goal to localStorage:', error)
      }
    }
  }, [carbsGoal, isInitialized])

  useEffect(() => {
    if (!isInitialized) return // Don't save until data is loaded
    
    if (fatGoal !== null) {
      try {
        localStorage.setItem('calorieTrackerFatGoal', fatGoal.toString())
        console.log('✅ Fat goal saved:', fatGoal)
      } catch (error) {
        console.error('Error saving fat goal to localStorage:', error)
      }
    }
  }, [fatGoal, isInitialized])

  useEffect(() => {
    if (!isInitialized) return // Don't save until data is loaded
    
    try {
      localStorage.setItem('calorieTrackerSelectedDate', selectedDate.toISOString())
      console.log('✅ Selected date saved:', selectedDate.toISOString())
    } catch (error) {
      console.error('Error saving selected date to localStorage:', error)
    }
  }, [selectedDate, isInitialized])

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
    protein: proteinGoal ? proteinGoal - consumed.protein : 0,
    carbs: carbsGoal ? carbsGoal - consumed.carbs : 0,
    fat: fatGoal ? fatGoal - consumed.fat : 0
  }

  // Berechne Prozentsätze für Progress Circles
  const percentages = {
    calories: dailyGoal ? Math.min((consumed.calories / dailyGoal) * 100, 100) : 0,
    protein: proteinGoal ? Math.min((consumed.protein / proteinGoal) * 100, 100) : 0,
    carbs: carbsGoal ? Math.min((consumed.carbs / carbsGoal) * 100, 100) : 0,
    fat: fatGoal ? Math.min((consumed.fat / fatGoal) * 100, 100) : 0
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

  // Handle Image Upload with compression
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Compress image if too large
      const maxSize = 500 * 1024 // 500KB
      if (file.size > maxSize) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            let width = img.width
            let height = img.height
            
            // Calculate new dimensions
            const maxDimension = 800
            if (width > height) {
              if (width > maxDimension) {
                height = (height / width) * maxDimension
                width = maxDimension
              }
            } else {
              if (height > maxDimension) {
                width = (width / height) * maxDimension
                height = maxDimension
              }
            }
            
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            
            const compressed = canvas.toDataURL('image/jpeg', 0.8)
            setMealForm(prev => ({
              ...prev,
              image: compressed,
              imagePreview: compressed
            }))
          }
          img.src = reader.result
        }
        reader.readAsDataURL(file)
      } else {
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
    const protein = Number(e.target.protein.value) || null
    const carbs = Number(e.target.carbs.value) || null
    const fat = Number(e.target.fat.value) || null
    
    if (goal > 0) {
      setDailyGoal(goal)
      if (protein > 0) setProteinGoal(protein)
      if (carbs > 0) setCarbsGoal(carbs)
      if (fat > 0) setFatGoal(fat)
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
            Ziele setzen
          </button>
        </div>
      )}

      {/* Main Calories Card */}
      {dailyGoal && (
        <>
          <div className="main-card">
            <div className="calories-info">
              <h2 className="calories-number">{remaining.calories >= 0 ? remaining.calories : 0}</h2>
              <p className="calories-label">Calories left</p>
            </div>
            <div className="main-progress">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke="#e5e5e5"
                  strokeWidth="10"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke="#000"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - Math.min(percentages.calories / 100, 1))}`}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
              </svg>
              <div className="flame-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8 2 6 5 6 9C6 11.5 7 13.5 8.5 15C9.5 16 10 17 10 18C10 19.5 11.5 21 13.5 21C15.5 21 17 19.5 17 18C17 17 17.5 16 18.5 15C20 13.5 21 11.5 21 9C21 5 19 2 15 2C13 2 12.5 2.5 12 3C11.5 2.5 11 2 12 2Z" fill="#000"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Macro Cards - Exact design from image */}
          <div className="macro-cards-main">
            <div className="macro-card-main protein-card">
              <div className="macro-info">
                <h2 className="macro-number-main">{proteinGoal ? (remaining.protein >= 0 ? remaining.protein : 0) : consumed.protein}g</h2>
                <p className="macro-label-main">Protein</p>
              </div>
              <div className="macro-progress">
                <svg className="macro-svg" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#ff6b6b"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#ff6b6b"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={proteinGoal ? `${2 * Math.PI * 42 * (1 - Math.min(percentages.protein / 100, 1))}` : `${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    opacity="0.3"
                  />
                </svg>
                <div className="macro-icon-center protein">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4L9 7H7C6.4 7 6 7.4 6 8V10C6 10.6 6.4 11 7 11H9L12 14V4Z" fill="#ff6b6b"/>
                    <path d="M18 8L16 10H14C13.4 10 13 10.4 13 11V13C13 13.6 13.4 14 14 14H16L18 16V8Z" fill="#ff6b6b"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="macro-card-main carbs-card">
              <div className="macro-info">
                <h2 className="macro-number-main">{carbsGoal ? (remaining.carbs >= 0 ? remaining.carbs : 0) : consumed.carbs}g</h2>
                <p className="macro-label-main">Carbs</p>
              </div>
              <div className="macro-progress">
                <svg className="macro-svg" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#ffa500"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#ffa500"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={carbsGoal ? `${2 * Math.PI * 42 * (1 - Math.min(percentages.carbs / 100, 1))}` : `${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    opacity="0.3"
                  />
                </svg>
                <div className="macro-icon-center carbs">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" fill="#ffa500"/>
                    <path d="M8 12L10.5 14.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="macro-card-main fat-card">
              <div className="macro-info">
                <h2 className="macro-number-main">{fatGoal ? (remaining.fat >= 0 ? remaining.fat : 0) : consumed.fat}g</h2>
                <p className="macro-label-main">Fat</p>
              </div>
              <div className="macro-progress">
                <svg className="macro-svg" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#4a90e2"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#4a90e2"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={fatGoal ? `${2 * Math.PI * 42 * (1 - Math.min(percentages.fat / 100, 1))}` : `${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    opacity="0.3"
                  />
                </svg>
                <div className="macro-icon-center fat">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8 2 5 5 5 9C5 13 8 16 12 16C16 16 19 13 19 9C19 5 16 2 12 2Z" fill="#4a90e2"/>
                    <path d="M12 6C9.8 6 8 7.8 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 7.8 14.2 6 12 6Z" fill="white" opacity="0.3"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick Add Button */}
      <button className="quick-add-btn" onClick={() => setShowQuickAdd(true)}>
        Schnell hinzufügen
      </button>

      {/* Recently Logged Section */}
      <div className="recently-logged">
        <h2 className="section-title">Recently logged</h2>
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
                    <div className="meal-image-placeholder">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3H21V21H3V3ZM5 5V19H19V5H5ZM7 7H17V17H7V7Z" fill="#86868b"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="meal-info">
                  <div className="meal-header">
                    <h3 className="meal-name">{meal.name}</h3>
                    <span className="meal-time">{meal.time}</span>
                  </div>
                  <p className="meal-calories">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flame-icon-small">
                      <path d="M12 2C8 2 6 5 6 9C6 11.5 7 13.5 8.5 15C9.5 16 10 17 10 18C10 19.5 11.5 21 13.5 21C15.5 21 17 19.5 17 18C17 17 17.5 16 18.5 15C20 13.5 21 11.5 21 9C21 5 19 2 15 2C13 2 12.5 2.5 12 3C11.5 2.5 11 2 12 2Z" fill="#000"/>
                    </svg>
                    {meal.calories} calories
                  </p>
                  {(meal.protein > 0 || meal.carbs > 0 || meal.fat > 0) && (
                    <div className="meal-macros">
                      {meal.protein > 0 && (
                        <span className="macro-item protein-macro">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4L9 7H7C6.4 7 6 7.4 6 8V10C6 10.6 6.4 11 7 11H9L12 14V4Z" fill="#ff6b6b"/>
                            <path d="M18 8L16 10H14C13.4 10 13 10.4 13 11V13C13 13.6 13.4 14 14 14H16L18 16V8Z" fill="#ff6b6b"/>
                          </svg>
                          {meal.protein}g
                        </span>
                      )}
                      {meal.carbs > 0 && (
                        <span className="macro-item carbs-macro">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="8" fill="#ffa500"/>
                            <path d="M8 12L10.5 14.5L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {meal.carbs}g
                        </span>
                      )}
                      {meal.fat > 0 && (
                        <span className="macro-item fat-macro">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C8 2 5 5 5 9C5 13 8 16 12 16C16 16 19 13 19 9C19 5 16 2 12 2Z" fill="#4a90e2"/>
                            <path d="M12 6C9.8 6 8 7.8 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 7.8 14.2 6 12 6Z" fill="white" opacity="0.3"/>
                          </svg>
                          {meal.fat}g
                        </span>
                      )}
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
              <div className="form-group image-upload-group">
                <label>Bild hochladen</label>
                {!mealForm.imagePreview ? (
                  <label className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input-hidden"
                    />
                    <div className="upload-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <p>Bild auswählen</p>
                      <span>oder hier ablegen</span>
                    </div>
                  </label>
                ) : (
                  <div className="image-preview-wrapper">
                    <div className="image-preview">
                      <img src={mealForm.imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => setMealForm({ ...mealForm, image: null, imagePreview: null })}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    <label className="change-image-btn">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input-hidden"
                      />
                      Bild ändern
                    </label>
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
              <h2>Ziele setzen</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
            </div>
            <form onSubmit={handleSaveGoal}>
              <div className="form-group">
                <label>Kalorien pro Tag *</label>
                <input
                  type="number"
                  name="goal"
                  defaultValue={dailyGoal || ''}
                  required
                  min="1"
                  placeholder="z.B. 2500"
                />
              </div>
              <div className="form-group">
                <label>Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  defaultValue={proteinGoal || ''}
                  min="0"
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label>Kohlenhydrate (g)</label>
                <input
                  type="number"
                  name="carbs"
                  defaultValue={carbsGoal || ''}
                  min="0"
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label>Fett (g)</label>
                <input
                  type="number"
                  name="fat"
                  defaultValue={fatGoal || ''}
                  min="0"
                  placeholder="Optional"
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

