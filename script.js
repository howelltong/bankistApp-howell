'use strict';

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2023-01-27T09:15:04.904Z',
    '2023-01-29T09:15:04.904Z',
    '2023-01-30T09:15:04.904Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions


// creating external function for simplicity of code
const formatMovementDate = function (date, locale) {
  //---------2. Operation with dates
  //place at top of scop 
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))

  const daysPassed = calcDaysPassed(new Date(), date) //current date and date received by function
  console.log(daysPassed); //days between current date and movement executed

  //custom days passsed return string, longer than 7 days return actual date itself
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  //-----3. INTERNATIONALISATION => remove old code
  // //no need to use 'else' statement as following code is only executed if the previous if statements aren't returned
  // const day = `${date.getDate()}`.padStart(2, 0); //format double digit => e.g 02 instead of 2
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear()
  // return `${day}/${month}/${year}`

  //-----3. INTERNATIONALISATION => add API
  return new Intl.DateTimeFormat(locale).format(date) //no options required


}

const formatCur = function (value, locale, currency) { //pass in parameters that is reusable across applications
  //-------4. INTERNATIONALISATION => NUMBERS
  return new Intl.NumberFormat(locale, { //no need to create new variable (variable => formatCur)
    style: 'currency',
    currency: currency,
  }).format(value)
}

//////////////APP 1: MATH AND ROUNDING => DISPLAY NUMBERS TO 2 DECIMAL PLACES/////////////
//-----1. Pass in entire accounts array to get access to both movements and movementsDate (originally only passed in 'movements' as an argument)
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  //------1. movements ===> acc.movements (Specify property as movements is not being passed directly anymore)
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //-------1. loop over both mov and mov dates using index (originall just mov)
    //call forEach on movements, but use given i to loop over a different array
    const date = new Date(acc.movementsDates[i]) // => convert from str to js Date object 

    //result should be the output of formatMovementDate
    const displayDate = formatMovementDate(date, acc.locale)

    //-------4. INTERNATIONALISATION => NUMBERS
    const formattedMov = formatCur(mov, acc.locale, acc.currency)

    //-----1. ADD DATE TO HTML DISPLAY
    const html = ` 
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div> 
      </div>
    `;
    //.toFixed(2) => 2 decimal places on the displayed number

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//////////////APP 1: MATH AND ROUNDING => DISPLAY NUMBERS TO 2 DECIMAL PLACES/////////////
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  //-------4. INTERNATIONALISATION => NUMBERS
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency); //.toFixed(2) => 2 decimal places on the displayed number
};


//////////////APP 1: MATH AND ROUNDING => DISPLAY NUMBERS TO 2 DECIMAL PLACES/////////////
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`; //.toFixed(2) => 2 decimal places on the displayed number
  //-------4. INTERNATIONALISATION => NUMBERS
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`; //.toFixed(2) => 2 decimal places on the displayed number
  //-------4. INTERNATIONALISATION => NUMBERS
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`; //.toFixed(2) => 2 decimal places on the displayed number
  //-------4. INTERNATIONALISATION => NUMBERS
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc); //------1. acc.movements ===> acc (pass in entire account to the displayMovements function)

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};


//---------6. SET LOGOUT TIMER 

const startLogOutTimer = function () {
  //pseudo code to export some functionality into an external function
  //export function out of setInterval => start immediately and then call again every second
  const tick = function () {
    //convert timer to mins and seconds 
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0)

    //in each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;



    //when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      // Display UI and message
      labelWelcome.textContent = `Log in to get started
        `;
      containerApp.style.opacity = 0;
    }

    //place after so that at end of time will display 0
    //decrease 1s
    time--;
  }

  //set start time to 5 minutes
  let time = 120;


  //call the timer eery second
  tick()
  const timer = setInterval(tick, 1000) //CB function is called after interval (after one second) => need to change to immediate
  return timer //to clear the timer (clearInterval()) requires timer variable

}

///////////////////////////////////////
// Event handlers 
let currentAccount, timer; //global variables, persist between different logins (otherwise will disappear after completion)

// // FAKE ALWAYS STAY LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity = 100;



btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) { //+inputLoginPin.value === Number(inputLoginPin.value)
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
      }`;
    containerApp.style.opacity = 100;

    // ------1. Set date below current balance on LOGIN
    const now = new Date();
    //providing options object for additional formatting
    const options = { //additional properties
      hour: 'numeric',
      minute: 'numeric',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    }
    //defining locale using user's browser and not manually inputting (e.g. en-AU)
    // const locale = navigator.language //note accounts objects have their own locale, will use that instead
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now) //using Intl Namespace API + date to be formatted
    //requires login to display


    // labelDate.textContent = now //results in a long convoluted date => need to simplify 'day/month/year' format
    //formatting 
    //-------3. Internationalisation => remove previous code for API
    // const day = `${now.getDate()}`.padStart(2, 0); //format double digit => e.g 02 instead of 2
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`; //note that time will be static in this format

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //timer 
    //first clear timer
    if (timer) clearInterval(timer)
    timer = startLogOutTimer(); //reset timer to the designated start time in external function 

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //-----1. add date of transfer to movementsDate (transfer out)
    currentAccount.movementsDates.push(new Date().toISOString())
    //-----1. add date of transfer to movementsDate (transfer in)
    receiverAcc.movementsDates.push(new Date().toISOString())
    //NOTE: in real world application, transfers would most likely have its own object rather than a simple movementsDate array

    // Update UI
    updateUI(currentAccount);

    //reset timer 
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});


//////////////APP 1: MATH AND ROUNDING => CHANGE INPUTS TO INTEGERS/////////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value); //note that floor() already does type coercion, no need to manually convert to number

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //------5. SET TIMEOUT()
    setTimeout(function () {// Add movement
      currentAccount.movements.push(amount);

      //-----1. add date of transfer to movementsDate (transfer out)
      currentAccount.movementsDates.push(new Date().toDateString())

      // Update UI
      updateUI(currentAccount);

      //reset timer 
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000)
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted); ////------1. currentAccount.movements ===> currentAccount (pass in entire account to the displayMovements function)
  sorted = !sorted;
});
