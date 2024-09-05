// Bubble Segments are rounded off quads
class bubbleSegment 
{
    constructor(x, y, width, height, angle) 
    {
        // xPos and yPos are center of "main" bubble
        this.xPos = x;
        this.yPos = y;
        this.width = width;
        this.height = height;
        this.angle = angle%TWO_PI;
    }
  
    draw() 
    {
        fill(200, 50, 9);
        noStroke();
        ellipse(this.xPos, this.yPos, this.width, this.width); // Main bubble
        ellipse(this.xPos + this.height*cos(this.angle), this.yPos + this.height*sin(this.angle), this.width, this.width); // End Bubble
        // Cut width in half for radius, add 90 so sides are perpendicular
        quad(
            this.xPos + this.width/2 * cos(this.angle + PI/2), 
            this.yPos + this.width/2 * sin(this.angle + PI/2), // (x1, y1)
            this.xPos - this.width/2 * cos(this.angle + PI/2), 
            this.yPos - this.width/2 * sin(this.angle + PI/2), // (x2, y2)
            this.xPos + this.height * cos(this.angle) - this.width/2 * cos(this.angle + PI/2), 
            this.yPos + this.height * sin(this.angle) - this.width/2 * sin(this.angle + PI/2), // (x3, y3)
            this.xPos + this.height * cos(this.angle) + this.width/2 * cos(this.angle + PI/2), 
            this.yPos + this.height * sin(this.angle) + this.width/2 * sin(this.angle + PI/2)  // (x4, y4)
        );
    }
}

class arcSegment
{
    constructor(x, y, width, radius, startAngle, endAngle) 
    {
        this.xPos = x;
        this.yPos = y;
        this.radius = radius;
        this.width = width%(2*radius); // Width must be smaller than radius
        this.startAngle = startAngle%TWO_PI; // Angle in radians
        this.endAngle = endAngle%TWO_PI; // Angle in radians
    }

    draw()
    {
        noStroke();
        fill(200, 50, 9);
        arc(this.xPos, this.yPos, this.radius * 2, this.radius * 2, this.startAngle, this.endAngle);
        ellipse(this.xPos + (this.radius - this.width/4) * cos(this.startAngle), this.yPos + (this.radius - this.width/4) * sin(this.startAngle), this.width / 2, this.width / 2);
        ellipse(this.xPos + (this.radius - this.width/4) * cos(this.endAngle), this.yPos + (this.radius - this.width/4) * sin(this.endAngle), this.width / 2, this.width / 2);
        fill(255, 255, 255);
        arc(this.xPos, this.yPos, this.radius*2 - this.width, this.radius*2 - this.width, this.startAngle, this.endAngle);
    }
    
}

var segments = [];
let segmentMove = 0;
let kSpeedX;
let kSpeedY;
let sSpeedX;
let sSpeedY;

function setup() 
{
    kSpeedX = random(-5, 5);
    kSpeedY = random(-5, 5);
    sSpeedX = random(-5, 5);
    sSpeedY = random(-5, 5);
    angleMode(RADIANS);
    createCanvas(400, 400);
    // Initial Conditions can be Configured Here
    segments.push(new bubbleSegment(150, 0, 20, 100, PI/2)); // Back of K
    segments.push(new bubbleSegment(300, 50, 20, 70, 7*PI/4)); // Top Leg of K
    segments.push(new bubbleSegment(300, 350, 0, 0, PI/4)); // Bottom Leg of K
    // Arcs have negative 1 width to start with to prevent visual glitch
    segments.push(new arcSegment(250, 175, -1, 35, 9*PI/8, 9*PI/8)); // Top Arc
    segments.push(new arcSegment(250, 225, -1, 35, PI/8, PI/8)); // Bottom Arc
}
  
function draw() 
{
    background(255);
    // Final Conditions Configured in if statements, linear growth/progression of each segment is in else
    switch(segmentMove)
    {
        // Slide in Back of K
        case 0:
            if(segments[0].yPos == 150)
            {
                segmentMove = 1;
            }
            else
            {
                segments[0].yPos += 5;
            }
        break;
        // Slide in Top Leg of K
        case 1:
            if(segments[1].yPos == 200 && segments[1].xPos == 150)
            {
                segmentMove = 2;
            }
            else
            {
                segments[1].yPos += 5;
                segments[1].xPos -= 5;
            }
        break;
        // Grow Bottom Leg of K
        case 2:
            if(segments[2].width == 20 && segments[2].height == 70)
            {
                segmentMove = 3;
            }
            else
            {
                segments[2].width += 1;
                segments[2].height += 3.5;
            }
        break;
        // Slide in Bottom Leg of K
        case 3:
            if(segments[2].yPos == 200 && segments[2].xPos == 150)
            {
                segmentMove = 4;
            }
            else
            {
                segments[2].yPos -= 5;
                segments[2].xPos -= 5;
            }
        break;
        // Spin and Grow Top Arc
        case 4:
            if(segments[3].width >= 39 && segments[3].startAngle <= PI/2 && segments[3].endAngle >= 7*PI/4) // Span of 5PI/4
            {
                segmentMove = 5;
                segments[3].width = 40;
                segments[3].startAngle = PI/2;
                segments[3].endAngle = 7*PI/4;
            }
            else
            {
                segments[3].width += 1;
                segments[3].startAngle -= 5*PI/320;
                segments[3].endAngle += 5*PI/320;
            }
        break;
        // Spin and Grow Bottom Arc
        case 5:
            if(segments[4].width >= 39 && segments[4].startAngle <= -PI/2 && segments[4].endAngle >= 3*PI/4) // Span of 5PI/4
            {
                segmentMove = 6;
                segments[4].width = 40;
                segments[4].startAngle = -PI/2;
                segments[4].endAngle = 3*PI/4;
            }
            else
            {
                segments[4].width += 1;
                segments[4].startAngle -= 5*PI/320;
                segments[4].endAngle += 5*PI/320;
            }
        break;
        // Move Around
        case 6:
            // Position Based on Base K origin and End Bubble of K Leg
            if((segments[0].xPos - segments[0].width/2) <= 0 || (segments[1].xPos + segments[1].height*cos(segments[1].angle) + segments[1].width) >= 400)
            {
                kSpeedX *= -1; // Change Direction
            }
            if(segments[0].yPos + segments[0].height + segments[0].width/2 >= 400 || segments[0].yPos - segments[1].width/2 <= 0)
            {
                kSpeedY *= -1;
            }
            // Position Based on S
            if(segments[3].xPos - segments[3].radius <= 0 || segments[3].xPos + segments[3].radius >= 400)
            {
                sSpeedX *= -1;
            }
            if(segments[3].yPos - segments[3].radius <= 0 || segments[4].yPos + segments[4].radius >= 400)
            {
                sSpeedY *= -1;
            }
            segments[0].xPos += kSpeedX;
            segments[1].xPos += kSpeedX;
            segments[2].xPos += kSpeedX;
            segments[0].yPos += kSpeedY;
            segments[1].yPos += kSpeedY;
            segments[2].yPos += kSpeedY;
            segments[3].xPos += sSpeedX;
            segments[4].xPos += sSpeedX;
            segments[3].yPos += sSpeedY;
            segments[4].yPos += sSpeedY;
        break;
    }
    for (var i=0; i<segments.length; i++) 
    {
        // print("SegmentMove: " + segmentMove);
        // Dont draw segment 2 prior to case 2, segment 3 prior to case 4, segment 4 prior to case 5
        if(segmentMove < 2 && (i == 0 || i == 1))
        {
            segments[i].draw();
            // print("Segment: " + i);
        }
        else if(segmentMove < 4 && (i != 3 || i != 4))
        {
            segments[i].draw();
            // print("Segment: " + i);
        }
        else if(segmentMove < 5 && i != 4)
        {
            segments[i].draw();
            // print("Segment: " + i);
        }
        else if(segmentMove >= 5)
        {
            segments[i].draw();
        }
    }
}