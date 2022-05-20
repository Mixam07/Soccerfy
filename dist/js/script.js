"use strict";
document.addEventListener("DOMContentLoaded", async function() {
  const sliderCarrousel = document.querySelector(".slider__carrousel"),
        sliderWindow = document.querySelector(".slider__window") || true,
        sliderItems = document.querySelectorAll(".slider__item"),
        arrowLeft = document.querySelector(".arrow_left"),
        arrowRight = document.querySelector(".arrow_right"),
        today = document.querySelector(".footer__today"),
        todayDate = new Date(),
        todayDay =  (todayDate.getDate() < 10) ? "0" + todayDate.getDate() : todayDate.getDate(),
        todayMonth = ((todayDate.getMonth() + 1) < 10) ? "0" + (todayDate.getMonth() + 1): todayDate.getMonth() + 1,
        buttons = document.querySelectorAll(".description__button"),
        table = document.querySelector(".table"),
        information = document.querySelector(".information"),
        bestPlayers = document.querySelector(".best"),
        leagueTable = document.querySelector(".table__wrapper"),
        LeagueInf = document.querySelector("[data-leagueInf]"),
        clubTable = document.querySelector(".information__table"),
        clubInf = document.querySelector("[data-clubInf]"),
        key1 = "a3171b7dae3b90af2e251224a909ebdc76075897e3dcdd4505854420dd6a53b5",
        key2 = "ba92c23bc2cf07f86aad0962db548a8931bc2e02cca94fbb7bfbeeee385e97f9";

  let widthItem, marginRightItem, widthSlider, timer = true,widthScreenPX = window.clientWidth;

  async function findLeague(leagueKey, key) {
    let informationLeage = await requests(`https://apiv2.allsportsapi.com/football/?&met=Leagues&leagueKey=152&APIkey=${key}`),
        result;

    console.log(informationLeage);

    informationLeage.result.forEach(item => {
      if(!result){
        if(item.league_key == leagueKey){
          result = item;
        }
      }
    });

    return result;
  }

  async function requests(url){
    let information = await fetch(url);

    if (!information.ok) {
      throw new Error(`Could not fetch ${url}, status: ${information.status}`);
    }

    return await information.json()
  }

  function carouselMovement(e, widthItem, marginRightItem, lastPosition){
    e.preventDefault();
    
    //Провіряє чи слайдер в русі, якщо ні то перегортає
    if(timer){
      sliderCarrousel.style.left = `${lastPosition - widthItem - marginRightItem}px`;
      timer = false;
      setTimeout(() => timer = true, 500);
    }
  }

  if(sliderWindow !== true){
    function addWidthItems(itemInSlider = 4) {
      widthSlider = sliderWindow.clientWidth;
      marginRightItem = +(window.getComputedStyle(sliderItems[0]).marginRight.replace("px", ""));
      widthItem = ((widthSlider + marginRightItem) / itemInSlider) - marginRightItem;
  
      sliderCarrousel.style.left = `0px`;
      
      sliderItems.forEach(item => {
        item.style.width = `${widthItem}px`;
      });
    }

    function countItemsInSlider() {
      const widthScreenREM =  widthScreenPX / +(window.getComputedStyle(document.querySelector("body")).fontSize.replace("px", ""));
      
      if(widthScreenREM > 47.625){
        addWidthItems(8);
      }else if(widthScreenREM > 36){
        addWidthItems(7);
      }else if(widthScreenREM > 31.25){
        addWidthItems(6);
      }else if(widthScreenREM > 25.6){
        addWidthItems(5);
      }else {
        addWidthItems();
      }
    }
  
    window.addEventListener("resize", () => {
      if(widthScreenPX !== window.outerWidth){
        widthScreenPX = window.outerWidth;
  
        countItemsInSlider();
      }
    });

    countItemsInSlider();
  }

  try{
    arrowRight.addEventListener("click", (e)=> {
      const lastPosition = +(window.getComputedStyle(sliderCarrousel).left.replace("px", ""));
      if(lastPosition !== -(((widthItem + marginRightItem) * (sliderItems.length)) - marginRightItem - widthSlider)){
        carouselMovement(e, widthItem, marginRightItem, lastPosition);
      }
    });
    arrowLeft.addEventListener("click", (e)=> {
      const lastPosition = +(window.getComputedStyle(sliderCarrousel).left.replace("px", ""));
      if(lastPosition < 0){
        carouselMovement(e, - widthItem, - marginRightItem, lastPosition);
      }
    });
  }catch(e){}

  try{
    today.innerHTML = `${todayDay}.${todayMonth}.${todayDate.getFullYear()}`;
  }catch(e){}

  try{
    buttons[0].addEventListener("click", () => {
      if(table){
        table.classList.add("table_active");
      }else if(information){
        information.classList.add("information_active");
      }
      
      bestPlayers.classList.remove("best_active");
    });

    buttons[1].addEventListener("click", () => {
      if(table){
        table.classList.remove("table_active");
      }else if(information){
        information.classList.remove("information_active");
      }

      bestPlayers.classList.add("best_active");
    });
  }catch(e){}
  
  try{
    if(leagueTable){
      //const leagueKey = prompt("League key(152 207 206 153 175 168(ligue1) 302)", "168");
      (async (leagueKey) => {
        const informationTable = await requests(`https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=${leagueKey}&APIkey=${key1}`),
              informationLeage = await findLeague(leagueKey, key1);
  
        LeagueInf.innerHTML = `
          <div class="description__img-league"><img src=${informationLeage.league_logo} alt=""></div>
          <div class="description__wrapper">
            <div class="description__name">${informationLeage.league_name}</div>
            <div class="description__information">2021/2022</div>
            <button class="description__img-star"><img src="icons/Star.svg" alt="Star"></button>
          </div>
        `;
  
        leagueTable.innerHTML = `
          <tr class="table__tr-main">
            <th class="table__th number-main">#</th>
            <th class="table__th team-main">Team</th>
            <th class="table__th">MP</th>
            <th class="table__th result-matches">W</th>
            <th class="table__th result-matches">D</th>
            <th class="table__th result-matches">L</th>
            <th class="table__th">G</th>
            <th class="table__th">GD</th>
            <th class="table__th">PTS</th>
            <th class="table__th f">F</th>
          </tr>
        `;
        console.log(informationTable);
  
        informationTable.result.total.forEach(item => {
          const backgroundColor = (/Champions League/.test(item.standing_place_type))? "green":
                                  (/Europa League/.test(item.standing_place_type))? "yellow":
                                  (/Conference League/.test(item.standing_place_type))? "yellow":
                                  (/Relegation/.test(item.standing_place_type))? "red": "gray";
  
          leagueTable.innerHTML += `
            <tr class="table__tr">
              <td class="table__td ${backgroundColor} number">${item.standing_place}</td>
              <td  class="table__td">
                <div class="team">
                  <img src="" alt="">
                  <a href="club.html" class="table__name">${item.standing_team}</a>
                </div>
              </td>
              <td class="table__td">${item.standing_P}</td>
              <td class="table__td result-matches">${item.standing_W}</td>
              <td class="table__td result-matches">${item.standing_D}</td>
              <td class="table__td result-matches">${item.standing_L}</td>
              <td class="table__td">${item.standing_F}:${item.standing_A}</td>
              <td class="table__td">${(item.standing_GD > 0)? "+"+item.standing_GD : item.standing_GD}</td>
              <td class="table__td">${item.standing_PTS}</td>
              <td class="table__td f">
                <div class="last-result">
                  <span class="table__text w"></span>
                  <span class="table__text w"></span>
                  <span class="table__text w"></span>
                  <span class="table__text l"></span>
                  <span class="table__text d"></span>
                </div>
              </td>
            </tr>
          `;
        });
  
        informationTable.result.total.forEach(async (item, i) => {
          const logo = await requests(`https://apiv2.allsportsapi.com/football/?&met=Teams&teamId=${item.team_key}&APIkey=${key1}`);
  
          leagueTable.children[i+1].children[0].children[1].children[0].children[0].src = logo.result[0].team_logo;
        });
  
      })(152)
      //leagueKey
    }
  }catch(e){}

  try{
    if(clubTable){
      //const clubKey = prompt("League key(100,80)", "100");
      (async (clubKey) => {
        const informationClub = await requests(`https://apiv2.allsportsapi.com/football/?&met=Teams&teamId=${clubKey}&APIkey=${key2}`);

        clubInf.innerHTML = `
          <div class="description__img-league"><img src=${informationClub.result[0].team_logo} alt=""></div>
          <div class="description__wrapper">
            <div class="description__name">${informationClub.result[0].team_name}</div>
            <div class="description__information">${informationClub.result[0].coaches[0].coach_name}</div>
            <button class="description__img-star"><img src="icons/Star.svg" alt="Star"></button>
          </div>
        `;

        clubTable.innerHTML = `
          <tr class="information__tr-main">
            <th class="information__th">#</th>
            <th class="information__th">Name</th>
            <th class="information__th number-player">Number</th>
            <th class="information__th age">Age</th>
            <th class="information__th matches-player">Matches</th>
            <th class="information__th">Goals</th>
            <th class="information__th cards">Yellow Card</th>
            <th class="information__th cards">Red Card</th>
            <th class="information__th">Position</th>
          </tr>
        `;

        informationClub.result[0].players.forEach((item, i) => {
          clubTable.innerHTML += `
          <tr class="information__tr">
            <td class="information__td number">${i + 1}</td>
            <td class="information__td player">
              <div class="information__photo">
                <img src=${item.player_image} alt="">
              </div>
              <a href="player.html" class="best__name">${item.player_name}</a>
            </td>
            <td class="information__td number-player">${item.player_number}</td>
            <td class="information__td age">${item.player_age}</td>
            <td class="information__td matches-player">${item.player_match_played}</td>
            <td class="information__td">${item.player_goals}</td>
            <td class="information__td cards">${item.player_yellow_cards}</td>
            <td class="information__td cards">${item.player_red_cards}</td>
            <td class="information__td">${item.player_type.slice(0,4)}..</td>
          </tr>
          `;
        });
      })(100)
    }
  }catch(e){}

  //console.log(await requests(`https://apiv2.allsportsapi.com/football/?met=Comments&APIkey=${key1}&matchId=902316`));
});