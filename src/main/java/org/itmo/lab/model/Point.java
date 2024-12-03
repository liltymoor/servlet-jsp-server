package org.itmo.lab.model;

public class Point {
    private double x, y, R;

    public Point(double x, double y, double R) {
        this.x = x;
        this.y = y;
        this.R = R;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getR() {
        return R;
    }
}
