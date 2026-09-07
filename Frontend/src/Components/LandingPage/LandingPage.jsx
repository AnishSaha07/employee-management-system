import "./LandingPage.css";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserShield,
  FaChartLine,
  FaMoneyCheckAlt,
  FaArrowRight,
  FaCheckCircle,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="logo">

          <div className="logo-box">
            <span className="logo-a">A</span>
            <span className="logo-s">S</span>
          </div>

          <div className="logo-text">
            <h2>AS GROUP</h2>
            <p>of Industry</p>
          </div>

        </div>

        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <Link to="/login" className="login-btn">
          Login
        </Link>
      </nav>

      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-left">

          <span className="tag">
            Smart Employee Management Platform
          </span>

          <h1>
            Manage Your
            <span> Workforce </span>
            With Confidence.
          </h1>

          <p>
            AS GROUP of Industry provides a modern Employee Management
            System that simplifies attendance, payroll, employee records,
            performance tracking, and task management—all from one secure
            platform.
          </p>

          <div className="hero-buttons">

            <Link to="/login" className="primary-btn">
              Login as Admin
            </Link>

            <Link to="/login" className="secondary-btn">
              Employee Login
            </Link>

          </div>

          <div className="hero-points">

            <div>
              <FaCheckCircle />
              Secure
            </div>

            <div>
              <FaCheckCircle />
              Fast
            </div>

            <div>
              <FaCheckCircle />
              Reliable
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="hero-right">

          <div className="dashboard-card">

            <div className="dashboard-top">
              <div className="circle blue"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>

            <div className="graph"></div>

            <div className="small-cards">

              <div className="mini-card">
                <FaUsers />
                <span>Employees</span>
                <h3>1,280</h3>
              </div>

              <div className="mini-card">
                <FaChartLine />
                <span>Performance</span>
                <h3>98%</h3>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="features" id="services">

        <div className="section-title">

          <span>OUR SERVICES</span>

          <h2>
            Everything You Need In
            <span> One Platform</span>
          </h2>

          <p>
            Manage your organization efficiently with powerful tools.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">

            <div className="icon">
              <FaUsers />
            </div>

            <h3>Employee Records</h3>

            <p>
              Maintain employee profiles, departments, documents and
              personal information securely.
            </p>

            <button className="learn-btn">
              Learn More <FaArrowRight />
            </button>

          </div>

          <div className="feature-card">

            <div className="icon">
              <FaUserShield />
            </div>

            <h3>Attendance Tracking</h3>

            <p>
              Track attendance, leaves, holidays and work hours with
              automated reports.
            </p>

            <a href="/">
              Learn More <FaArrowRight />
            </a>

          </div>

          <div className="feature-card">

            <div className="icon">
              <FaMoneyCheckAlt />
            </div>

            <h3>Payroll Management</h3>

            <p>
              Salary processing, deductions, bonuses and payslip generation
              made simple.
            </p>

            <a href="/">
              Learn More <FaArrowRight />
            </a>

          </div>

        </div>

      </section>

      {/* ================= WHY US ================= */}

      <section className="why-us" id="about">

        <div className="left">

          <div className="big-logo">
            <span>A</span>
            <span>S</span>
          </div>

        </div>

        <div className="right">

          <span className="small-title">
            WHY AS GROUP
          </span>

          <h2>
            Smart Technology.
            <span> Better Management.</span>
          </h2>

          <p>
            Our Employee Management System is designed to increase
            productivity while reducing manual work. Built with security,
            scalability and ease of use in mind.
          </p>

          <ul>

            <li>✔ Employee Database</li>

            <li>✔ Attendance Automation</li>

            <li>✔ Payroll System</li>

            <li>✔ Secure Dashboard</li>

          </ul>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats">

        <div>
          <h2>500+</h2>
          <p>Companies</p>
        </div>

        <div>
          <h2>10K+</h2>
          <p>Employees</p>
        </div>

        <div>
          <h2>99.9%</h2>
          <p>System Uptime</p>
        </div>

        <div>
          <h2>24/7</h2>
          <p>Support</p>
        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="cta">

        <h2>Ready to Modernize Your Workforce?</h2>

        <p>
          Join AS GROUP of Industry and experience next-generation employee
          management.
        </p>

        <Link to="/login" className="primary-btn">
          Get Started
        </Link>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer" id="contact">

        <div className="footer-left">

          <h2>AS GROUP</h2>

          <p>
            Building smarter workplaces through modern employee management.
          </p>

        </div>

        <div className="footer-right">

          <FaLinkedin />

          <FaTwitter />

          <FaEnvelope />

        </div>

      </footer>

    </div>
  );
};

export default LandingPage;