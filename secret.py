def secret(X):
    total=0
    for X in range(2):
        digits=n%10
        total=total+digits
        X=X//10
    print("The sum of digits is:",total)
    
X = input()
run = secret(X)
