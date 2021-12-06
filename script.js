'use strict';


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// making up the classes
class workout 
{
    date=new Date();
    // id=(new Date()+'').slice(-10);
    id = (Date.now() + '').slice(-10);
    constructor(coords,distance,duration)
    {
        this.coords=coords
        this.distance=distance
        this.duration=duration
        console.log(this.date);
    }
    _getcurrentDate()
    {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        
        this.description=`${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`



    }

}
class running extends workout
{
    type='running';
 constructor(coords,distance,duration,cadence)
 {
     super(coords,distance,duration,cadence)
     this.cadence=cadence
     this._pace()
     this._getcurrentDate()

 }
 _pace()
 {
     this.pace=this.distance/this.duration
     return this.pace
 }
 
}
let run=new running([22,33],23,5,4)
class cycling extends workout

{
    type='cycling';
    constructor(coords,distance,duration,elev)
 {
     super(coords,distance,duration)
     this.elev=elev
     this._speed()
     this._getcurrentDate()

 }
 _speed()
{
this.speed=this.distance/this.duration*60
return this.speed
}
}
let cyc=new cycling([22,33],25,2,1)
console.log(run);
console.log(cyc);
class app
{
    #map;
    #mapevent;
    #workout=[];
    constructor()
    {
        this._getPosition()

         // get the stroage from local storage
     this._getStorage()
        form.addEventListener('submit',this._newworkout.bind(this))
        inputType.addEventListener('change',this._toogle.bind(this)) 
        containerWorkouts.addEventListener('click',this._moveform.bind(this))
    }

    _getPosition()
    {
        navigator.geolocation.getCurrentPosition(this._loadmap.bind(this),function()
        {
            alert('acces denied')
        })
    }
    _loadmap(position)
        {
            
        console.log(position);
        let {latitude}=position.coords
        let {longitude}=position.coords
        console.log(latitude,longitude);
        console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);
        //leaflet
             this.#map = L.map('map').setView([latitude, longitude], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
    
       this.#map.on('click',this._showform.bind(this))


       this.#workout.forEach(val=>
        {
            // this.renderform(val)
            this.RenderMarker(val)
        }
        )

       
     

        } 
        _moveform(e)
        {
           let click=e.target.closest('.workout')
           console.log(click);
           if(!click) return 
           //find the id using the very own finidng keys throwgh in Arrays where Arrays == #workout
           let find=this.#workout.find(val=>val.id==click.dataset.id);
           console.log(find);
           console.log(workout.coords);
           this.#map.setView(find.coords,13,{
               animate:true,
               pan:{
                   duration:1
               }
           })

        }



_newworkout(e)
        {
    //helper functions 
    let _finite=(...inputs)=>inputs.every(val=>Number.isFinite(val))
    let _postive=(...inputs)=>inputs.every(val=>val>0)
     
    console.log(e);
    let {lat}=this.#mapevent.latlng
    let{lng}=this.#mapevent.latlng
    // console.log(x,y);

    /// get data from form
    let type=inputType.value
    let distance=Number(inputDistance.value)
    let duration=+inputDuration.value
    let workout;
    console.log(type,distance,duration);





    

     //if workout running create runnig object
     if(type=='running')
     {
         let cadence=+inputCadence.value
         //checking the validation
         if(!_finite(distance,duration,cadence)||!_postive(distance,duration,cadence)) return alert('enter  number')
         workout=new running([lat,lng],distance,duration,cadence)
         this.#workout.push(workout)
         console.log(workout);
         console.log('this is',this.#workout);
     }
     ///if workout cycling create cucling object
     if (type=='cycling')
     {
        let Elevation=+inputElevation.value
        //checking the validation
        if(!_finite(distance,duration,Elevation)||!_postive(distance,duration,Elevation)) return alert('enter  number')
        workout=new cycling([lat,lng],distance,duration,Elevation)
        this.#workout.push(workout)
        console.log(workout);
     };
     ///render maarker on the map
     this.RenderMarker(workout)

     ///render workout on map
     this.renderform(workout)
     //hide the form
     this.hideform()
     // store data to storage
     this._setLocalstorage()
    

    
        }
        /// function of render form
        renderform(workout)
        { let html;

            html=`<li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
              <span class="workout__icon">${workout.type=='running'?'🏃':'🚲'}</span>
              <span class="workout__value">${workout.distance}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${workout.duration}</span>
              <span class="workout__unit">min</span>
            </div>`
            
            if(workout.type=='running')
            {
                html+=` <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">min/km</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.pace.toFixed()}</span>
                <span class="workout__unit">spm</span>
              </div>
            </li>`
            }
            if(workout.type=='cycling')
            {
                html+=` <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.elev}</span>
                <span class="workout__unit">min/km</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">spm</span>
              </div>
            </li>`
            }
            




            form.insertAdjacentHTML('afterend',html)


        }
 
        ///function to remove form
        hideform()
        {
            inputDistance.value=inputCadence.value=inputDuration.value=inputElevation.value='';
            form.classList.add('hidden')
            form.style.display='none'
            setTimeout(()=>form.style.display='grid',1000)
            
        }
    /////function of render marker
        RenderMarker(workout)
        {
        L.marker(workout.coords).addTo(this.#map)
      .bindPopup(L.popup({
          maxWidth:250,
          minWidth:100,
          autoClose:false,
          closeOnClick:false,
          className:`${workout.type}-popup`
      
      }
  
      )
      )
      .setPopupContent(`${workout.type=='running'?'🏃':'🚲'}${workout.description}`)
  
      .openPopup();
  }

_showform(mape)
{
    this.#mapevent=mape;
            console.log(mape);
            form.classList.remove('hidden')
            inputDistance.focus()

        }
 ///toggrlr
 _toogle()
 {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')

}

_setLocalstorage()
{
    localStorage.setItem('works',JSON.stringify(this.#workout))
}
_getStorage()
{
    let data=JSON.parse( localStorage.getItem('works'))
    console.log(data,'df');
    if(!data) return

    this.#workout=data
     this.#workout.forEach(val=>
        {
            this.renderform(val)
        }
        )
}
reset()
{
    localStorage.removeItem('works')
    location.reload()
}
 }       
// get a new object 
let apk=new app()