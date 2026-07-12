# Contributing to TransitOps

Welcome to the TransitOps repository! As a collaborative team effort, this project is split into distinct modules to ensure parallel development, prevent merge conflicts, and establish clear ownership of features.

## 👥 Module Ownership & Roles

To ensure accountability and smooth collaboration, module ownership is distributed among the team. If you are reviewing this code (e.g., judges or open-source contributors), the following breakdown explains who built what:

*   **[Insert Teammate 1 Name]** 
    *   **Role:** Backend / Database Architect
    *   **Modules Owned:** Authentication, Database Schema, Backend CI/CD, Prisma Migrations.
*   **[Insert Teammate 2 Name]** 
    *   **Role:** Frontend Developer (Fleet & Assets)
    *   **Modules Owned:** Vehicle Management Dashboard, Maintenance Tracking UI, `feature/frontend-vehicles` branch.
*   **[Insert Teammate 3 Name]** 
    *   **Role:** Frontend Developer (Operations & Dispatch)
    *   **Modules Owned:** Trip Dispatch UI, Driver Management, Fuel & Expenses UI, `feature/frontend-trips` branch.
*   **[Insert Teammate 4 Name / QA Lead]** 
    *   **Role:** Quality Assurance & Testing
    *   **Modules Owned:** End-to-end testing, Jest backend integration tests, React Testing Library suite, `feature/testing` branch.

*(Note: Please update the placeholders above with your actual team members' names before the final submission.)*

## 🌿 Git Workflow & Branches

To maintain a clean and demonstrable Git history, we strictly follow a feature-branching workflow. **No one should commit directly to `main`.**

### Active Feature Branches
The following branches have been set up for the remaining work. Teammates must checkout their respective branch, commit their code, and open a Pull Request (PR) for review:

1.  `feature/frontend-vehicles` - For all UI components related to the vehicle fleet.
2.  `feature/frontend-trips` - For trip dispatching and driver assignment UI.
3.  `feature/testing` - For all unit and integration tests.

### How to Contribute
1. Checkout your assigned branch: `git checkout feature/<branch-name>`
2. Make your commits with clear, descriptive messages: `git commit -m "feat(trips): implement dispatch modal"`
3. Push your branch: `git push origin feature/<branch-name>`
4. Open a Pull Request into `main` and tag another module owner for review.

By following this workflow, our Git log will naturally reflect a true multi-contributor environment.
