package org.itmo.lab;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.itmo.lab.model.Point;
import org.itmo.lab.model.Table;
import org.itmo.lab.model.TableRow;

import java.io.IOException;
import java.time.LocalDate;

@WebServlet(name = "check_area")
public class AreaCheckServlet extends HttpServlet {

    private static boolean checkIfDotBelongsToFigure(Point point) {
        double x = point.getX();
        double y = point.getY();
        double r = point.getR();

        // окружность
        if (x >= 0d && y >= 0d && (x * x + y * y <= (r/2) * (r/2))) return true;

        // треугольник
        if ((-x - r) <= y && x <= 0d && y <= 0d) return true;

        // прямоугольник
        if (y <= 0d && x <= r && x >= 0d && y >= (float) -r / 2) return true;

        return false;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        long startTime = System.nanoTime();
        HttpSession session = req.getSession();
        Point point = (Point) req.getAttribute("point");
        Table table = (Table) session.getAttribute("table");

        if (checkIfDotBelongsToFigure(point))
            table.addRow(point, startTime, true);
        else
            table.addRow(point, startTime, false);



        res.sendRedirect(req.getContextPath());
//        req.getRequestDispatcher("./index.jsp").forward(req,res);

        System.out.println("hi");
        System.out.println(table.pointsInArea());

    }
}
