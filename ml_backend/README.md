# Plant Disease Detection ML Backend

This is the machine learning backend for the Plant Disease Detection application. It uses TensorFlow and MobileNetV2 for image classification.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd ml_backend
pip install -r requirements.txt
```

### 2. Get Training Data

Download the PlantVillage dataset from Kaggle:
https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset

Or organize your own images in this structure:
```
plant_disease_dataset/
  Apple___Apple_scab/
    image1.jpg
    image2.jpg
  Apple___Black_rot/
    image1.jpg
  Tomato___Bacterial_spot/
    image1.jpg
  ...
```

### 3. Train the Model

```bash
python train_model.py
```

This will:
- Train a MobileNetV2-based model on your dataset
- Save the trained model as `plant_disease_model.h5`
- Save class mappings to `class_indices.json`
- Save disease information to `disease_info.json`

Training takes about 15-30 minutes depending on your hardware and dataset size.

### 4. Run the API Server

```bash
python app.py
```

The API will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and model information.

### Predict Disease
```
POST /predict
Content-Type: multipart/form-data

Body:
  image: [image file]
```

Returns:
```json
{
  "success": true,
  "plant": "Tomato",
  "disease": "Early Blight",
  "confidence": 0.95,
  "causes": "Fungal infection caused by Alternaria solani",
  "symptoms": "Dark spots with concentric rings on lower leaves",
  "treatment": "Apply fungicides, remove infected leaves",
  "prevention": "Mulch plants, water at base, ensure good air circulation",
  "alternative_predictions": [...]
}
```

### Get Classes
```
GET /classes
```
Returns all available disease classes.

## Supported Diseases

The model currently supports:

**Apple:**
- Apple Scab
- Black Rot
- Cedar Apple Rust
- Healthy

**Tomato:**
- Bacterial Spot
- Early Blight
- Late Blight
- Leaf Mold
- Healthy

**Potato:**
- Early Blight
- Late Blight
- Healthy

## Model Architecture

- Base: MobileNetV2 (pretrained on ImageNet)
- Input size: 224x224 pixels
- Classes: 12 (expandable)
- Framework: TensorFlow/Keras

## Adding More Diseases

1. Add images to your dataset folder with naming format: `PlantName___DiseaseName/`
2. Update `DISEASE_INFO` in `train_model.py` with disease details
3. Retrain the model: `python train_model.py`

## Performance Tips

- Use a GPU for faster training (CUDA-enabled GPU recommended)
- Minimum 1000 images per class for good accuracy
- Balance your dataset (similar number of images per class)
- Use image augmentation (already included in training script)

## Troubleshooting

**Model not loading:**
- Make sure you've run `train_model.py` first
- Check that `plant_disease_model.h5` exists

**Low accuracy:**
- Add more training images
- Train for more epochs
- Balance your dataset
- Check image quality

**API errors:**
- Verify Flask and TensorFlow are installed correctly
- Check that port 5000 is available
- Enable CORS if calling from different domain
