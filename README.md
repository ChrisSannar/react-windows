# Window Manager
​
A react window creator that can hold other components

## Requirements
​
We need you to build a window manager in React. It needs to have all the basic features of a desktop environment, namely:
​
* They need to be resizable
* They need a title bar across the top that
    * has an icon
    * has a title
    * has a minimize button
    * has a maximize button
    * has a close button
    * is draggable
* A bar at the bottom of the browser window that shows all the open windows with their icon.
    * when you click on that icon it toggles between minimized and maximized.
    * when you click and drag the icons they can be rearranged.
    * Windows do not cover this bar if they are dragged over it.
* There needs to be a way to launch new windows. "Desktop icons" would be fine for this.
​
## Constraints
​
* You must use only React function components. No class components.
* This must be written in Typescript.
​
## Bonus
​
* Use your testing framework of choice to write tests for your components.
* Implement Modal behavior:
    * A modal window is launched from another window.
    * The parent window cannot be interacted with when the modal window is open.
    * A modal window is always on top of the parent.