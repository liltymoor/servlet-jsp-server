package org.itmo.lab;

import org.itmo.lab.model.Point;

public class Validator {
    public static boolean validate(Point mapPoint) {
        System.out.println(mapPoint.getX());
        System.out.println(mapPoint.getY());
        System.out.println(mapPoint.getR());

        if (mapPoint.getX() >= -2 || mapPoint.getX() <= 2)
            return false;

        if (mapPoint.getY() >= -3 || mapPoint.getY() <= 3)
            return false;

        if (mapPoint.getR() >= 1 || mapPoint.getR() <= 3)
            return false;

        return true;
    }
}
