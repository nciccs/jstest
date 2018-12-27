class Collision
{
    static collideRectObject(object1, object2)
    {
        return Collision.collideRectCentre(object1.x, object1.y, object1.width, object1.height, object2.x, object2.y, object2.width, object2.height);
    }

    static collideRectCentre(x1, y1, width1, height1, x2, y2, width2, height2)
    {
        let topLeftX1 = x1-width1/2;
        let topLeftY1 = y1-height1/2;
        
        let topLeftX2 = x2-width2/2;
        let topLeftY2 = y2-height2/2;

        return Collision.collideRect(topLeftX1, topLeftY1, width1, height1, topLeftX2, topLeftY2, width2, height2);
    }

    static collideRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h)
    {
        let collided = false;

        // are the sides of one rectangle touching the other?
        if (r1x + r1w >= r2x &&    // r1 right edge past r2 left
        r1x <= r2x + r2w &&    // r1 left edge past r2 right
        r1y + r1h >= r2y &&    // r1 top edge past r2 bottom
        r1y <= r2y + r2h)     // r1 bottom edge past r2 top
        {
            collided = true;
        }

        return collided;
    }
}