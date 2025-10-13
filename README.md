# Plant Disease Detection System

AI-powered plant disease detection using Machine Learning and Digital Image Processing.

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Python** (v3.8+) - [Download Python](https://www.python.org/downloads/)
- **VS Code** (recommended) - [Download VS Code](https://code.visualstudio.com/)

### 📦 Installation & Setup

#### Step 1: Open Project in VS Code

```bash
# Clone the repository (if not already cloned)
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd plant-disease-detection

# Open in VS Code
code .
```

#### Step 2: Setup Frontend (React + Vite)

Open a terminal in VS Code (Terminal → New Terminal) and run:

```bash
# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on **http://localhost:8080**

#### Step 3: Setup ML Backend (Python + TensorFlow)

Open a **new terminal** in VS Code (click the + icon in terminal panel):

```bash
# Navigate to ML backend directory
cd ml_backend

# Install Python dependencies
pip install -r requirements.txt

# Optional: Download PlantVillage dataset
# https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset

# Train the model (one-time setup, takes 15-30 minutes)
python train_model.py

# Start the API server
python app.py
```

The ML backend will run on **http://localhost:5000**

### ✅ Verify Setup

1. Frontend: Open http://localhost:8080 in your browser
2. Backend: Check http://localhost:5000/health - should show `{"status": "healthy"}`
3. Upload a plant image and click "Analyze Disease"

## 🗂️ Project Structure

```
plant-disease-detection/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── Hero.tsx             # Landing section
│   │   ├── ImageUpload.tsx      # Image upload interface
│   │   └── AnalysisResults.tsx  # Disease results display
│   ├── pages/                   # Page components
│   └── index.css                # Design system & styles
├── ml_backend/                   # Python ML backend
│   ├── app.py                   # Flask API server
│   ├── train_model.py           # Model training script
│   ├── requirements.txt         # Python dependencies
│   └── README.md                # ML backend documentation
└── README.md                    # This file
```

## 🧠 Supported Plant Diseases

**Apple:** Apple Scab, Black Rot, Cedar Apple Rust, Healthy
**Tomato:** Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Healthy
**Potato:** Early Blight, Late Blight, Healthy

## 🛠️ VS Code Setup Tips

### Recommended Extensions
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Python** - Python language support
- **Pylance** - Python IntelliSense

### Running Both Servers Simultaneously

1. **Split Terminal**: Click the split icon in VS Code terminal
2. **Terminal 1**: Run `npm run dev` (Frontend)
3. **Terminal 2**: Run `cd ml_backend && python app.py` (Backend)

### Troubleshooting

**Frontend won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend errors:**
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install --upgrade -r ml_backend/requirements.txt
```

**"Failed to fetch" errors:**
- Ensure ML backend is running on http://localhost:5000
- Check CORS is enabled in `ml_backend/app.py`
- Verify no firewall blocking localhost:5000

## 📚 Technologies Used

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn-ui components

**ML Backend:**
- TensorFlow/Keras
- Flask + Flask-CORS
- MobileNetV2 (Transfer Learning)
- PIL for image processing

## 🌐 Deployment

Frontend: [Lovable](https://lovable.dev/projects/b5c83364-5e6a-44f5-8fef-27270bc38230) → Share → Publish

Backend: Deploy to services like Railway, Render, or AWS EC2

## 📖 Additional Resources

- [ML Backend Documentation](ml_backend/README.md)
- [Lovable Documentation](https://docs.lovable.dev)
- [PlantVillage Dataset](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)
