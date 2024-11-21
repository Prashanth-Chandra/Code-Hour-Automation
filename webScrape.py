from bs4 import BeautifulSoup

white_scores = []
white_students = []

n = int(input("Enter the number of html files : "))

for i in range(1,n+1):
    file_path = f'./Whte/{i}.html' 
    print(file_path)

    with open(file_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, "html.parser")
    # print(soup)
    html_id = soup.find_all(class_="cursor leaderboard-hackername rg_5")
    # print(type(paragraphs))
    students = []
    for p in html_id:
        students.append(p.text.strip())
        # print(p.text.strip())    

    html_score = soup.find_all(class_="span-flex-3")
    scores = []
    for p in html_score:
        if(p.text.strip()[:2].isnumeric()):
            scores.append(p.text.strip())
            # print(p.text.strip())    

    # print(len(students), len(scores))

    for i,j in zip(students, scores):
        print(i,j)
        print()

print(len(students), len(scores))

