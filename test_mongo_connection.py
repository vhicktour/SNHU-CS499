from pymongo import MongoClient

try:
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    
    # Test connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
    
    # Check database and collection
    db = client['cs499']
    collection = db['shelter_outcomes']
    
    # Count documents
    doc_count = collection.count_documents({})
    print(f"\nFound {doc_count} documents in shelter_outcomes collection")
    
    # Show sample document
    if doc_count > 0:
        print("\nSample document:")
        print(collection.find_one())

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    client.close()