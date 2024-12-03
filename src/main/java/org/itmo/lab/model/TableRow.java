package org.itmo.lab.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TableRow {
    final private Point point;
    final private long execTime;
    final private LocalDate execDate;
    final private boolean inArea;

    public TableRow(Point point, long execStart, boolean inArea) {
        this.point = point;
        execTime = System.nanoTime() - execStart;
        execDate = LocalDate.now();
        this.inArea = inArea;
    }

    public Point getPoint() {
        return point;
    }

    public long getExecTime() {
        return execTime;
    }

    public LocalDate getExecDate() {
        return execDate;
    }

    public boolean isInArea() {
        return inArea;
    }
}
