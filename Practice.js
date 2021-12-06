'use strict';

// prettier-ignore


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
// let map=document.querySelector('map')
// geo location
class workout{
    date=new Date();
    id=(Date.now()+'').slice(-10)
    constructor(coords,distance,duration)
    {
        this.coords=coords
        this.distance=distance
        this.duration=duration

    }
    _descriptive()
    {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.descriptive=`${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
        // console.log(descriptive);
        return this.descriptive
        
    }

}
class running extends workout
{
    type='running';
    constructor(coords,distance,duration,cadence)
    {
        super(coords,distance,duration)
        this.cadence=cadence
        this._speed()
        this._descriptive()
    }
    _speed()
    {
        this.speed=this.distance/this.duration
        return this.speed
    }
}
class cycle extends workout
{
    type='cycling';
    constructor(coords,distance,duration,elevation)
    {
        super(coords,distance,duration)
        this.elevation=elevation
        this._decration()
        this._descriptive()
    }
    _decration()
    {
        this.decration=this.distance/this.duration*60
        return this.decration
    }
}
let c=new cycle([21,23],212,12,3)
let r= new running([12,23],23,34,12)
// console.log(c);
// console.log(r);








class App{
    #workout=[];
    #mapevent
    #map;
    constructor()
    {
        // getting first location of map and setting the corrditnates from map using geolocation
        this._getLocation()
        //toggle menu in the cart
        containerWorkouts.addEventListener('change',this._toggle.bind(this))
        //submits form
        form.addEventListener('submit',this._workout.bind(this))
        //move to marker
        containerWorkouts.addEventListener('mouseover',this._movetomarker.bind(this))


    }

    // getting current location
    _getLocation()
    {
        navigator.geolocation.getCurrentPosition(this._location.bind(this),function()
        {
            alert('enter ur location')
        })
    }

    ///succesful callback of ocation
    _location(posi)
    {
        // this.#mapevent=posi
        // console.log(posi);
       let  {latitude,longitude}=posi.coords
    //    console.log(latitude,longitude);


       /////loading of map on current position 

       this.#map = L.map('map').setView([latitude,longitude], 13);

       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.#map);

  
  this.#map.on('click',this._getform.bind(this))
       
    }
    // /get the form from the html in the window screen to display
    _getform(e)
    {
        this.#mapevent=e
        // console.log(this.#mapevent);
       form.classList.remove('hidden')
       inputDistance.focus()
        

    }
    _toggle()
    {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    } 
    // the main function called as workout
    _workout(e)
    {
        e.preventDefault()
        let {lat,lng}=this.#mapevent.latlng
        // console.log(lat,lng);
        // console.log(latitude);
        let type=inputType.value
        let distance=inputDistance.value
        let duration=inputDuration.value

        let workout;

        if(type=='cycling')
        {
            let elevation=inputElevation.value
            workout=new cycle([lat,lng],distance,duration,elevation)
        }
        
        if(type=='running')
        {
            
            let cadence=inputCadence.value
            workout=new running([lat,lng],distance,duration,cadence)
        }
        console.log(workout);
        // this.#workout.push(workout)

        this.#workout.push(workout)
        //show marker on map
        this._showmarker(workout)
        //show workout on map
        this._showWorkout(workout)
        // remove the form
        this._removeForm()

    }
    //removeform
    _removeForm()
    {
        inputCadence.value,inputElevation.value,inputDuration.value,inputDistance.value = ''
        form.classList.add('hidden')
        form.style.display='none'
        setTimeout(()=>
        {
            form.style.display='grid'
        },1000)

    }
    ///function of showmarker
    _showmarker(work)
    {
        L.marker(work.coords).addTo(this.#map)
    .bindPopup(work.descriptive,'dd')
    .openPopup();
    }
    //function of workout
    _showWorkout(work)
    {
        let html;
            html=`<li class="workout workout--${work.type}" data-id="${work.id}">
            <h2 class="workout__title">${work.descriptive}</h2>
            <div class="workout__details">
              <span class="workout__icon">${work.type=='cycling'?'🚲':'🏃‍♂️'}</span>
              <span class="workout__value">${work.distance}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${work.duration}</span>
              <span class="workout__unit">min</span>
            </div>`
            if(work.type=='cycling')
            {
              html+=` <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${work.elevation}</span>
              <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⛰</span>
              <span class="workout__value">${work.decration}</span>
              <span class="workout__unit">m</span>
            </div>`  
            }
            if(work.type=='running')
            {
                html+=` <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${work.cadence}</span>
                <span class="workout__unit">min/km</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${work.speed}</span>
                <span class="workout__unit">spm</span>
              </div>
            </li>`

            }


            
            form.insertAdjacentHTML('afterend',html)

    }
    /// this is the funvtion to move to 
    _movetomarker(e)
    {
        let click=e.target.closest('.workout')
        console.log(click);
        let find=this.#workout.find(val=>val.id===click.dataset.id)
        console.log(find?.id);
        this.#map.setView(find.coords,13,{
            animate:true,
            pan:{
                duration:1
            }
        })
        
    }


}
let app=new App()
