var canvas=document.querySelector("canvas");
var score=0;
canvas.height=window.innerHeight-document.querySelector("h1").clientHeight;
canvas.width=window.innerWidth;

canvas.style.background="black";
var colour_arr=["blue","yellow","green"];
var arr_object=[];
var arr_enimies=[];
var c=canvas.getContext("2d");
window.addEventListener("resize",function()
{
    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;
    myplayer.x=(canvas.width)/2;
    myplayer.y=(canvas.height)/2;
})
canvas.addEventListener("click",function(click)
{
    var angle=Math.atan2((click.clientY-canvas.clientHeight/2),(click.clientX-canvas.clientWidth/2));
    vel_x=Math.cos(angle)*6;
    vel_y=Math.sin(angle)*6;
    arr_object.push(new Projectile(canvas.width/2,canvas.height/2,10,"red",vel_x,vel_y));
})


class Player
{
    constructor(val_x,val_y,radius,color)
    {
        this.x=val_x;
        this.y=val_y;
        this.radius=radius;
        this.color=color;
    }
    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle=this.color;
        c.fill();
    }
}
class Projectile extends Player
{
    constructor(x,y,radius,color,velocity_x,velocity_y)
    {
        super(x,y,radius,color);
        this.velocity_x=velocity_x;
        this.velocity_y=velocity_y;
    }
    move()
    {
        this.x+=this.velocity_x;
        this.y+=this.velocity_y;
        this.draw();
    }

    //Checks the collision between Enemy and the Main Player
    check()
    {
        if(Math.sqrt( Math.pow(canvas.width/2-this.x,2) + Math.pow(canvas.height/2-this.y,2) )<20+this.radius)
        {
            cancelAnimationFrame(animate_id);
            
            window.location.href=("./first_page.html");
        }
    }
}


function make_enimies()
{
    setInterval(() => 
    {
        var y=Math.random()*canvas.height;
        var x=Math.random()*canvas.width;
        var angle=Math.atan2((canvas.height/2-y),(canvas.width/2-x));
        vel_x=Math.cos(angle)*4;
        vel_y=Math.sin(angle)*4;
        arr_enimies.push(new Projectile(x,y,(Math.random()+2)*15,"grey",vel_x,vel_y));
    }, 1500);
}
var myplayer=new Player(canvas.width/2,canvas.height/2,20,"white");
var value=0;
var animate_id=undefined;
function animate()
{
    animate_id=requestAnimationFrame(animate);
    c.fillStyle="rgba(0,0,0,0.13)";
    c.fillRect(0,0,canvas.width,canvas.height);
    myplayer.draw();
    for(var i=0;i<arr_object.length;i++)
    {
        if( arr_object[i].x>canvas.width || arr_object[i].y>canvas.height || arr_object[i].y<0 || arr_object[i].x<0)
        {
            // to remove projectile out of array when they are out of frame.
            arr_object.splice(i,1);
        }
        if(arr_object.length>0)
        {
            arr_object[i].move();
        }
    }
    for(var i=0;i<arr_enimies.length;i++)
    {
        arr_enimies[i].move();
        
        for(var j=0;j<arr_object.length;j++)
        {
            if(Math.sqrt( Math.pow(arr_object[j].x-arr_enimies[i].x,2) + Math.pow(arr_object[j].y-arr_enimies[i].y,2) )<arr_object[j].radius+arr_enimies[i].radius)
            {
                if(arr_enimies[i].radius-10>10)
                {
                    arr_enimies[i].radius-=10;
                    arr_object.splice(j,1);
                    score+=20;
                }
                else
                {
                    arr_enimies.splice(i,1);
                    arr_object.splice(j,1);
                    i--;
                    j--;
                    score+=100;
                }
                document.querySelector("#score").innerHTML=score;
                
            }
        }
        if(arr_enimies.length>0)
        {
            arr_enimies[i].check();
        }
        
    }
}
animate();
make_enimies();
