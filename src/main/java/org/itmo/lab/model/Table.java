package org.itmo.lab.model;

import com.sun.source.util.TaskListener;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class Table {
    private final List<TableRow> list;
    public Table() {
        list = new ArrayList<>();
    }

    public long pointsInArea() {
        return list.stream().filter(point -> point.isInArea()).count();
    }

    public long pointsNotInArea() {
        return list.stream().filter(point -> !point.isInArea()).count();
    }

    public void addRow(Point point, long execStart, boolean inArea) {
        TableRow row = new TableRow(point, execStart, inArea);
        list.add(row);
    }

    public TableRow getItem(int idx) {
        return list.get(idx);
    }

    public int size() {
        return list.size();
    }
}
