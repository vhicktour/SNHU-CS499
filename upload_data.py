import pandas as pd
from pymongo.mongo_client import MongoClient

# MongoDB connection string for local instance
uri = "mongodb://localhost:27017"

try:
    # Create a new client and connect to the server
    client = MongoClient(uri)
    
    # Select database and collection
    db = client['cs499']
    collection = db['shelter_outcomes']
    
    # Load CSV data
    csv_file_path = '/Users/iam/Desktop/CS499/Module 7/grazioso-salvare-dashboard/data/aac_shelter_outcomes.csv'
    print(f"Loading data from {csv_file_path}")
    data = pd.read_csv(csv_file_path)
    
    # Print data info for verification
    print("\nDataset information:")
    print(f"Number of rows: {len(data)}")
    print(f"Number of columns: {len(data.columns)}")
    print("\nColumns:", list(data.columns))
    
    # Clear existing data and insert new data
    print("\nDropping existing collection...")
    collection.drop()
    
    print("Inserting new data...")
    collection.insert_many(data.to_dict('records'))
    
    # Verify insertion
    doc_count = collection.count_documents({})
    print(f"\nSuccessfully loaded {doc_count} documents into MongoDB")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    client.close()