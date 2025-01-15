from modules.animal_shelter import AnimalShelter

try:
    # Create shelter instance
    shelter = AnimalShelter()
    
    # Try to read one record
    result = shelter.read({}, limit=1)
    
    if result:
        print("Successfully connected and read from MongoDB!")
        print("\nSample record:")
        print(result[0])
    else:
        print("Connected to MongoDB but no records found.")
        
except Exception as e:
    print(f"Error: {e}")