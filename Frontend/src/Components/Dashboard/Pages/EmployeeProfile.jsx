import "./EmployeeProfile.css";

import ProfileCard from "../components/ProfileCard";
import PersonalInfoCard from "../components/PersonalInfoCard";
import JobInfoCard from "../components/JobInfoCard";
import BankDetailsCard from "../components/BankDetailsCard";

const EmployeeProfile = () => {

    return (

        <section className="employee-profile-page">

            <div className="employee-page-header">

                <div>

                    <h2>My Profile</h2>

                    <p>

                        View and manage your personal information.

                    </p>

                </div>

            </div>

            <div className="employee-profile-grid">

                <ProfileCard />

                <PersonalInfoCard />

                <JobInfoCard />

                <BankDetailsCard />

            </div>

        </section>

    );

};

export default EmployeeProfile;