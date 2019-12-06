#####    Python Snake Game    #####


#Import Statement
import random
import curses
import copy


#Create the screen and the window
screen = curses.initscr()
sheight, swidth = screen.getmaxyx()
window = curses.newwin(sheight, swidth, 0, 0)


#Configure the screen
curses.curs_set(0) #Disable blinking of the cursor
screen.keypad(1) #Enable keypad inputs
curses.cbreak() #Accept single keypad inputs without needing to hit enter each time
curses.noecho() #Accept keypad inputs without displaying to the screen
screen.timeout(100) #Refresh the page every 100ms


#Create and display the Snake
snk_x, snk_y = swidth / 4, sheight / 2
snake = [
    [snk_y, snk_x],
    [snk_y, snk_x - 1],
    [snk_y, snk_x - 2]
]
for part in snake:
    screen.addstr(part[0], part[1], "#")
screen.clear()


#Create and add the food
food = []
for i in range(8):
    f = None
    while f is None:
        #Get new food position
        f = [
            random.randint(1, sheight - 1),
            random.randint(1, swidth - 1)
        ]

        #Ensure the food doesn't lie on the snake
        if (f in snake) or (f in food):
            f = None
        else:
            food.append(f)

    #Display the food
    screen.addstr(f[0], f[1], "$")
    screen.refresh()



#Define the snake's movement
key = curses.KEY_RIGHT #Default direction of movement => Right
screen.move(0, 0) #Move cursor out of the screen
while True:
    #Accept the next key, if entered
    try:
        nextKey = screen.getch()
    except:
        pass
    if nextKey != -1:
        key = nextKey

    #End the game if the player has lost
    if (snake[0][0] not in range(1, sheight - 1)) or (snake[0][1] not in range(1, swidth - 1) or (snake[0] in snake[1:])):
        curses.nocbreak()
        screen.keypad(False)
        curses.echo()
        curses.endwin()
        print("Oops! Looks like you've lost. Better luck next time!")
        quit()

    #If the game is still on-going, calculate the snake's new head based on the
    #key that was pressed and add it to the body
    newHead = copy.deepcopy(snake[0]) #Deep copy needed!!!
    if key == curses.KEY_UP:
        newHead[0] -= 1
    if key == curses.KEY_DOWN:
        newHead[0] += 1
    if key == curses.KEY_LEFT:
        newHead[1] -= 1
    if key == curses.KEY_RIGHT:
        newHead[1] += 1
    snake.insert(0, newHead)

    #Display the new head
    screen.addstr(newHead[0], newHead[1], "#")
    screen.refresh()

    #Update the food, depending on whether or not the snake encountered it
    if snake[0] in food:
        f = None
        while f is None:
            #Get new food position
            f = [
                random.randint(1, sheight - 1),
                random.randint(1, swidth - 1)
            ]

            #Ensure the food doesn't lie on the snake
            if (f in snake) or (f in food):
                f = None
            else:
                food.append(f)

        #Update the food
        screen.addstr(f[0], f[1], "$")
        screen.refresh()
    else:
        #Pop the tail
        tail = snake.pop()
        screen.addstr(tail[0], tail[1], " ")
        screen.refresh()
