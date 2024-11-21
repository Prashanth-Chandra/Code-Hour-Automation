// All required global variables

let previous_home_color_index;
let white_score_index;
let red_score_index;
let orange_score_index;
let blue_score_index;
let green_score_index;
let total_score_index;
let feedback_index;
let resultLocation;

let students_count;

let data = [];
let totals = [];

let homeColors = [];
let feedbacks = [];

let previous_home_name;
let name_prefix;

let white_name;
let red_name;
let orange_name;
let blue_name;
let green_name;
let result_name;

let colorCount = {};

let headings;
let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
let sheet = spreadsheet.getSheetByName('test data 1');
let statSheet = spreadsheet.getSheetByName('Statistics');



// ----------------------------------------------------------------------------------------------------------


// START - GET CONSTANTS

const demote = {"RED": "WHITE", "ORANGE": "RED", "BLUE": "ORANGE"};
const promote = {"WHITE": "RED", "RED": "ORANGE", "ORANGE": "BLUE", "BLUE": "GREEN"};

function getNames(userInput){
  name_prefix;

  if(userInput > 0){
    name_prefix = `cet${userInput}`
  
    previous_home_name = `cet${userInput-1} color`
    result_name = `${name_prefix} color`
  }
  else{
    name_prefix = `blt`

    previous_home_name = `start color`
    result_name = `${name_prefix} color`
  }
  if(userInput === 1){
    previous_home_name = `blt color`
  }
  white_name = `${name_prefix}w`;
  red_name = `${name_prefix}r`;
  orange_name = `${name_prefix}o`;
  blue_name = `${name_prefix}b`;
  green_name = `${name_prefix}g`;

    
}

// END - GET CONSTANTS


// ----------------------------------------------------------------------------------------------------------


// START - LOAD DATA

function loadData(userInput){
  // Logger.log(userInput);
  previous_home_color_index = headings.indexOf(previous_home_name) + 1;
  white_score_index = previous_home_color_index + 1;
  red_score_index = previous_home_color_index + 2;
  orange_score_index = previous_home_color_index + 3;
  blue_score_index = previous_home_color_index + 4;
  green_score_index = previous_home_color_index + 5;
  total_score_index = previous_home_color_index + 6;
  feedback_index = previous_home_color_index + 7;
  resultLocation = previous_home_color_index + 8;

  students_count = sheet.getLastRow() - 1;
  // students_count = 4;
  Logger.log("Number of students : " + students_count);

  let student_data_range = sheet.getRange(2, previous_home_color_index, students_count, 6).getValues();

  for (let n = 0; n < students_count; n++) {
    let student_data = student_data_range[n];

    let home = student_data[0];
    let white = student_data[1];
    let red = student_data[2];
    let orange = student_data[3];
    let blue = student_data[4];
    let green = student_data[5];
    
    let student = [home, white, red, orange, blue, green];
    data.push(student);

    // if ((n + 1) % 50 == 0) {
    //   Logger.log(n + 1);
    // }
  }

  
}

// END - LOAD DATA


// ----------------------------------------------------------------------------------------------------------


// START - HOME CALCULATIONS MAIN

function calculateTotalScore(userInput){
  for(let n=2; n<=students_count+1; n++){
    let student = data[n-2];
    let total = 0;
    for(let i=1; i<=5; i++){
      total += student[i];
    }
    totals.push(total);
    sheet.getRange(n,total_score_index,1,1).setValue(total);
  }
  // Logger.log(totals);
}

function calculateHomeColor(userInput) {
  let homeColors = [];
  let feedbacks = [];

  for (let n = 2; n <= students_count + 1; n++) {
    let student = data[n - 2];
    let total = totals[n - 2];

    let feedback;
    let home;

    if (userInput > 0) {
      let passMinimum = passMinimumCriteria(student, total);

      home = student[0];
      feedback = passMinimum[1];

      if (passMinimum[0] === false) {
        home = demote[home];
      } else {
        let jump = passJumpCriteria(student, total);
        if (jump[0] === true) {
          home = promote[home];
          feedback = jump[1];
        }
      }
    } else {
      let values = base_line_test_calc(student, total);
      home = values[0];
      feedback = values[1];
    }

    homeColors.push(home);
    feedbacks.push(feedback);
  }

  for (let color of homeColors) {
    colorCount[color] = (colorCount[color] || 0) + 1;
  }

  Logger.log("Saving the data....")

  sheet.getRange(2, feedback_index, students_count, 1).setValues(feedbacks.map(f => [f]));
  sheet.getRange(2, resultLocation, students_count, 1).setValues(homeColors.map(h => [h]));

  // Logger.log(feedbacks);
  // Logger.log(homeColors);
  // Logger.log(colorCount);
}

function base_line_test_calc(student, total){
  let blue = student[4];
  if(blue > 20 && total >= 30){
    return [`BLUE`, `Congrats!! You have been promoted to BLUE`];
  }
  else if(total >= 20){
    return [`ORANGE`, `Congrats!! You have been promoted to ORANGE`];
  }
  else if(total >= 10){
    return [`RED`, `Congrats!! You have been promoted to RED`];
  }
  return [`WHITE`, `You scored well`];
}

function passJumpCriteria(student, total){
  let home = student[0];
  let white = student[1];
  let red = student[2];
  let orange = student[3];
  let blue = student[4];
  let green = student[5];

  if(home === "GREEN"){
    return [true, ""];
  }
  
  else if(home === "BLUE"){
    if(blue >= 60){
      return [true, `Congrats!! You have been promoted to ${promote[home]}`];
    }
  }
  else if(home === "ORANGE"){
    if(orange >= 30){
      return [true, `Congrats!! You have been promoted to ${promote[home]}`];
    }
  }
  else if(home === "RED"){
    if(red >= 20){
      return [true, `Congrats!! You have been promoted to ${promote[home]}`];
    }
  }
  else if(home === "WHITE"){
    if(white >= 10){
      return [true, `Congrats!! You have been promoted to ${promote[home]}`];
    }
  }
  return [false, `Failed to minimum criteria for ${home}. Check readme for minimum criteria`];
}

function passMinimumCriteria(student, total){
  let home = student[0];
  let white = student[1];
  let red = student[2];
  let orange = student[3];
  let blue = student[4];
  let green = student[5];

  if(home === "WHITE"){
    return [true, `You scored well ${home}`];
  }
  else if(home === "RED"){
    if(red >= 5 && total >= 10){
      return [true, `You have passed the minimum criteria for ${home}`];
    }
  }
  else if(home === "ORANGE"){
    if(orange >= 10 && total >= 20){
      return [true, `You have passed the minimum criteria for ${home}`];
    }
  }
  else if(home === "BLUE"){
    if(blue >= 30){
      return [true, `You have passed the minimum criteria for ${home}`];
    }
    if(orange === 30 && total >= 40){
      return [true, `You have passed the minimum criteria for ${home}`];
    }
  }
  else if(home === "GREEN"){
    return [true, ""];
  }
  return [false, `Failed to minimum criteria for ${home}. Check readme for minimum criteria`];

}

// END - HOME CALCULATIONS MAIN


// ----------------------------------------------------------------------------------------------------------


// START - ADD DATA COLUMNS

function insertResultRows(userInput, location){

  deleteIfExisting(userInput);

  sheet.insertColumnAfter(location);
  sheet.insertColumnAfter(location);
  sheet.insertColumnAfter(location);
  if(userInput > 0){
    sheet.getRange(1, location+1).setValue(`${name_prefix} Total Score`);
    sheet.getRange(1, location+2).setValue(`${name_prefix} Feedback`);
    sheet.getRange(1, location+3).setValue(`cet${userInput} color`);
  }
  else{
    sheet.getRange(1, location+1).setValue(`${name_prefix} Total Score`);
    sheet.getRange(1, location+2).setValue(`${name_prefix} Feedback`);
    sheet.getRange(1, location+3).setValue(`${name_prefix} color`);
  }

  sheet.getRange(1, location+1).setBackground('pink')
  sheet.getRange(1, location+2).setBackground('pink')
  sheet.getRange(1, location+3).setBackground('pink')

  refreshHeadings();
}

function deleteIfExisting(userInput){
  if(headings.includes(`${name_prefix} Total Score`)){
    sheet.deleteColumn((headings.indexOf(`${name_prefix} Total Score`)+1));
    refreshHeadings();
  }
  if(headings.includes(`${name_prefix} Feedback`)){
    sheet.deleteColumn((headings.indexOf(`${name_prefix} Feedback`)+1));
    refreshHeadings();
  }
  if(headings.includes(`cet${userInput+1} color`)){
    sheet.deleteColumn((headings.indexOf(`cet${userInput+1} color`)+1));
    refreshHeadings();
  }
  if(headings.includes(`${name_prefix} color`)){
    sheet.deleteColumn((headings.indexOf(`${name_prefix} color`)+1));
    refreshHeadings();
  }
}

// END - ADD DATA COLUMNS


// ----------------------------------------------------------------------------------------------------------


// START - UTIL

function refreshHeadings(){
  headings = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  // Logger.log(headings);
  resizeCols();
}

function resizeCols() {
  const lastColumn = sheet.getLastColumn();
  sheet.autoResizeColumns(1, lastColumn);
}

// END - UTIL


// ----------------------------------------------------------------------------------------------------------


// START - STATISTICS

function getStatistics(userInput){
  let statHeadings = statSheet.getRange(1, 1, 1, statSheet.getLastColumn()).getValues()[0]
  let statIndex;
  
  if(userInput == 0){
    statIndex = statHeadings.indexOf("blt");
  }
  else{
    statIndex = statHeadings.indexOf(`cet${userInput}`);
  }

  statSheet.getRange(2, statIndex+1, 1, 1).setValue(colorCount['WHITE']);
  statSheet.getRange(3, statIndex+1, 1, 1).setValue(colorCount['RED']);
  statSheet.getRange(4, statIndex+1, 1, 1).setValue(colorCount['ORANGE']);
  statSheet.getRange(5, statIndex+1, 1, 1).setValue(colorCount['BLUE']);
  statSheet.getRange(6, statIndex+1, 1, 1).setValue(colorCount['GREEN']);

  return 0;
}

// END - STATISTICS


// ----------------------------------------------------------------------------------------------------------


// START - MAIN FUNCTION

function myFunction() {
  // Empty Init
  refreshHeadings();

  // For getting which junction tett to calculate it for
  const userInput = parseInt(Browser.inputBox("Enter which Junction Test Results you want to calculate ", Browser.Buttons.OK_CANCEL));
  // const userInput = 0;


  if(isNaN(userInput)){
    Logger.log("No valid input given");
    return 0;
  }
  

  // Set the names
  Logger.log("Getting the names....")
  getNames(userInput);


  // Load data
  Logger.log("Loding the data....");
  loadData(userInput)

  
  // Insert the required columns
  Logger.log("Inserting the columns....");
  insertResultRows(userInput, total_score_index-1);


  // Just for safety
  refreshHeadings();

  // FLOW :: Get total score -> Validate the home color for next level and also about the reason for his promotion / demotion / why he remained in the same color

  // Calc total score
  Logger.log("Calculating the total score....");
  calculateTotalScore(userInput);

  // Calc home coloe
  Logger.log("Calculating the home color....");
  calculateHomeColor(userInput);
  resizeCols();


  Logger.log("Calculating the statistics....");
  getStatistics(userInput);
  resizeCols();

}


// END - MAIN FUNCTION


