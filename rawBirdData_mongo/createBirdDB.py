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

print(birds)