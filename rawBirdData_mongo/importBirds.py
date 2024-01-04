from pymongo import MongoClient

# MongoDB connection using the provided URL
client = MongoClient('mongodb+srv://birdmaster:b1rddata23@bird-data.ibhkut1.mongodb.net/sample_airbnb')

# Set your desired database and collection names
db = client['bird_database']  # Adjust as necessary
bird_collection = db['birds']  # Adjust as necessary

# Clear the collection to avoid duplicate entries
bird_collection.delete_many({})

# Process the bird list
birds = []

try:
    with open("birds_list.txt", "r") as file:
        lines = file.readlines()
        for line in lines:
            line = line.strip()
            if line:
                try:
                    common_name, scientific_name = line.split(' - ')
                    birds.append({"common_name": common_name, "scientific_name": scientific_name})
                except ValueError:
                    print(f"Skipping invalid line: {line}")
except FileNotFoundError:
    print("birds_list.txt not found.")

# Insert the list of dictionaries into MongoDB
bird_collection.insert_many(birds)

# Close the MongoDB client connection
client.close()
