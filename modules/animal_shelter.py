from pymongo import MongoClient

class AnimalShelter:
    def __init__(self):
        """Initialize connection to local MongoDB instance"""
        try:
            # Connect to local MongoDB
            self.client = MongoClient('mongodb://localhost:27017/')
            self.database = self.client['cs499']
            self.collection = self.database['shelter_outcomes']
            
            # Test connection
            self.client.admin.command('ping')
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise
    
    def read(self, query, limit=0):
        """
        Read documents from MongoDB collection
        
        Parameters:
            query (dict): MongoDB query dictionary
            limit (int): Maximum number of records to return (0 for all)
            
        Returns:
            list: List of documents matching the query
        """
        try:
            return list(self.collection.find(query).limit(limit))
        except Exception as e:
            print(f"Error reading from MongoDB: {e}")
            return []

    def __del__(self):
        """Cleanup MongoDB connection"""
        try:
            self.client.close()
        except:
            pass