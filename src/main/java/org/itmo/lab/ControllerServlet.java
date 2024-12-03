package org.itmo.lab;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.itmo.lab.model.Point;
import org.itmo.lab.model.Table;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("controller")
public class ControllerServlet extends HttpServlet {
    private static final Logger log = Logger.getLogger(ControllerServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        if (req.getSession().getAttribute("table") == null)
            req.getSession().setAttribute("table", new Table());

        double x = Double.parseDouble(req.getParameter("x"));
        double y = Double.parseDouble(req.getParameter("y"));
        double r = Double.parseDouble(req.getParameter("r"));

        Point point = new Point(x, y, r);

        if (Validator.validate(point)) {
            log.log(Level.WARNING, "Wrong data");
            res.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        req.setAttribute("point", point);
        getServletContext().getNamedDispatcher("check_area").forward(req,res);
    }
}
