import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import json
import os

# Disease information database
DISEASE_INFO = {
    "Apple___Apple_scab": {
        "plant": "Apple",
        "disease": "Apple Scab",
        "causes": "Fungal infection caused by Venturia inaequalis",
        "symptoms": "Dark, scabby lesions on leaves and fruit, premature leaf drop",
        "treatment": "Apply fungicides, prune infected branches, improve air circulation",
        "prevention": "Plant resistant varieties, remove fallen leaves, maintain proper spacing"
    },
    "Apple___Black_rot": {
        "plant": "Apple",
        "disease": "Black Rot",
        "causes": "Fungal infection caused by Botryosphaeria obtusa",
        "symptoms": "Brown spots on leaves, cankers on branches, fruit rot",
        "treatment": "Remove infected parts, apply copper-based fungicides",
        "prevention": "Prune dead wood, avoid wounding trees, practice good sanitation"
    },
    "Apple___Cedar_apple_rust": {
        "plant": "Apple",
        "disease": "Cedar Apple Rust",
        "causes": "Fungal infection requiring both apple and cedar hosts",
        "symptoms": "Yellow-orange spots on leaves, reduced fruit quality",
        "treatment": "Apply fungicides during spring, remove nearby cedar trees",
        "prevention": "Plant resistant varieties, avoid planting near cedar trees"
    },
    "Apple___healthy": {
        "plant": "Apple",
        "disease": "Healthy",
        "causes": "No disease detected",
        "symptoms": "Green leaves, no spots or lesions",
        "treatment": "No treatment needed",
        "prevention": "Continue regular maintenance and monitoring"
    },
    "Tomato___Bacterial_spot": {
        "plant": "Tomato",
        "disease": "Bacterial Spot",
        "causes": "Bacterial infection caused by Xanthomonas species",
        "symptoms": "Small dark spots on leaves and fruits, leaf yellowing",
        "treatment": "Remove infected plants, apply copper-based bactericides",
        "prevention": "Use disease-free seeds, avoid overhead watering, rotate crops"
    },
    "Tomato___Early_blight": {
        "plant": "Tomato",
        "disease": "Early Blight",
        "causes": "Fungal infection caused by Alternaria solani",
        "symptoms": "Dark spots with concentric rings on lower leaves",
        "treatment": "Apply fungicides, remove infected leaves",
        "prevention": "Mulch plants, water at base, ensure good air circulation"
    },
    "Tomato___Late_blight": {
        "plant": "Tomato",
        "disease": "Late Blight",
        "causes": "Oomycete infection caused by Phytophthora infestans",
        "symptoms": "Water-soaked spots on leaves, white mold on undersides",
        "treatment": "Apply fungicides immediately, destroy infected plants",
        "prevention": "Plant resistant varieties, avoid overhead watering"
    },
    "Tomato___Leaf_Mold": {
        "plant": "Tomato",
        "disease": "Leaf Mold",
        "causes": "Fungal infection caused by Passalora fulva",
        "symptoms": "Yellow spots on upper leaves, olive-green mold underneath",
        "treatment": "Improve ventilation, apply fungicides, remove infected leaves",
        "prevention": "Reduce humidity, space plants properly, use resistant varieties"
    },
    "Tomato___healthy": {
        "plant": "Tomato",
        "disease": "Healthy",
        "causes": "No disease detected",
        "symptoms": "Green leaves, no spots or lesions",
        "treatment": "No treatment needed",
        "prevention": "Continue regular maintenance and monitoring"
    },
    "Potato___Early_blight": {
        "plant": "Potato",
        "disease": "Early Blight",
        "causes": "Fungal infection caused by Alternaria solani",
        "symptoms": "Dark spots with target-like rings on leaves",
        "treatment": "Apply fungicides, remove infected foliage",
        "prevention": "Rotate crops, use certified seed potatoes, mulch well"
    },
    "Potato___Late_blight": {
        "plant": "Potato",
        "disease": "Late Blight",
        "causes": "Oomycete infection caused by Phytophthora infestans",
        "symptoms": "Dark water-soaked lesions on leaves and stems",
        "treatment": "Apply fungicides, destroy infected plants",
        "prevention": "Plant resistant varieties, avoid overhead irrigation"
    },
    "Potato___healthy": {
        "plant": "Potato",
        "disease": "Healthy",
        "causes": "No disease detected",
        "symptoms": "Green leaves, no spots or lesions",
        "treatment": "No treatment needed",
        "prevention": "Continue regular maintenance and monitoring"
    }
}

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 25
NUM_CLASSES = len(DISEASE_INFO)

def create_model(num_classes):
    """Create a CNN model for plant disease classification"""
    base_model = keras.applications.MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False
    
    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model

def train_model(data_dir):
    """
    Train the model on plant disease images
    
    Expected directory structure:
    data_dir/
        Apple___Apple_scab/
            image1.jpg
            image2.jpg
        Apple___Black_rot/
            image1.jpg
        ...
    """
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2,
        zoom_range=0.2,
        shear_range=0.2
    )
    
    # Load training data
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )
    
    # Load validation data
    validation_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    # Save class indices
    class_indices = train_generator.class_indices
    with open('ml_backend/class_indices.json', 'w') as f:
        json.dump(class_indices, f)
    
    print(f"Found {len(class_indices)} classes:")
    for class_name, idx in class_indices.items():
        print(f"  {idx}: {class_name}")
    
    # Create and compile model
    model = create_model(len(class_indices))
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            'ml_backend/plant_disease_model.h5',
            save_best_only=True,
            monitor='val_accuracy'
        ),
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3
        )
    ]
    
    # Train model
    history = model.fit(
        train_generator,
        validation_data=validation_generator,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    # Save final model
    model.save('ml_backend/plant_disease_model.h5')
    
    # Save disease information
    with open('ml_backend/disease_info.json', 'w') as f:
        json.dump(DISEASE_INFO, f, indent=2)
    
    print("\nTraining completed!")
    print(f"Model saved to: ml_backend/plant_disease_model.h5")
    print(f"Class indices saved to: ml_backend/class_indices.json")
    print(f"Disease info saved to: ml_backend/disease_info.json")
    
    return model, history

if __name__ == "__main__":
    # Example usage
    # Download PlantVillage dataset: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
    # Or use your own dataset with the same structure
    
    data_directory = "plant_disease_dataset"  # Change this to your dataset path
    
    if not os.path.exists(data_directory):
        print(f"Error: Dataset directory '{data_directory}' not found!")
        print("\nPlease download the PlantVillage dataset from:")
        print("https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset")
        print("\nOr organize your images in this structure:")
        print("plant_disease_dataset/")
        print("  Apple___Apple_scab/")
        print("    image1.jpg")
        print("  Apple___Black_rot/")
        print("    image2.jpg")
        print("  ...")
    else:
        os.makedirs('ml_backend', exist_ok=True)
        model, history = train_model(data_directory)
