export default class UI {
  static toogleSpinner() {
    const spinner = document.getElementById("spinner");
    const stylesVariable = window.getComputedStyle(spinner);
    const display = stylesVariable.getPropertyValue('--uib-display');
  
    if(display === 'flex') {
      spinner.style.setProperty('--uib-display', 'none');
    }else {
      spinner.style.setProperty('--uib-display', 'flex');
    }
  }

  static timerStartGame(timeStart, callBack) {
    const timerElement = document.getElementById("timer");
    let time = 10;
    timerElement.textContent = time;
    timerElement.style.display = 'block';
  
    const timer = setInterval(() => {
      time--;
      timerElement.textContent =  time;
    }, 1000);
    
  
    setTimeout(() => {
      clearInterval(timer);
      timerElement.style.display = 'none';
      callBack()
    }, timeStart * 1000);
  }
}
