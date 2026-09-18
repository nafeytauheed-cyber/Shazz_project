from __future__ import annotations

from datetime import datetime

from sqlmodel import SQLModel, Session, select

from app.db import engine
from app.models import Contact, Chunk, Document, Task, Team, User, Workspace


def seed_database():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        existing = session.exec(select(Workspace)).all()
        if existing:
            return {"seeded": False, "message": "already seeded"}

        nimbus = Workspace(name="Nimbus Labs", type="company", settings_json={"timezone": "UTC"})
        robotics = Workspace(name="Robotics Club", type="club", settings_json={"timezone": "UTC"})
        session.add(nimbus)
        session.add(robotics)
        session.commit()
        session.refresh(nimbus)
        session.refresh(robotics)

        backend_team = Team(workspace_id=nimbus.id, name="Backend")
        product_team = Team(workspace_id=nimbus.id, name="Product")
        session.add_all([backend_team, product_team])
        session.commit()

        admin = User(workspace_id=nimbus.id, email="jordan@nimbuslabs.example", name="Jordan", password_hash="demo", role="admin", job_role="Admin", team_id=backend_team.id, language="en")
        alex = User(workspace_id=nimbus.id, email="alex@nimbuslabs.example", name="Alex", password_hash="demo", role="member", job_role="Software Engineer", team_id=backend_team.id, start_date=datetime.utcnow(), language="en")
        sam = User(workspace_id=nimbus.id, email="sam@nimbuslabs.example", name="Sam", password_hash="demo", role="member", job_role="Designer", team_id=product_team.id, start_date=datetime.utcnow(), language="en")
        session.add_all([admin, alex, sam])
        session.commit()

        contacts = [
            Contact(workspace_id=nimbus.id, name="IT Helpdesk", role="IT", email="helpdesk@nimbuslabs.example", expertise_text="IT helpdesk, VPN access, laptop setup, SSO, password reset", topics=["vpn", "access", "laptop", "sso"]),
            Contact(workspace_id=nimbus.id, name="HR", role="HR", email="hr@nimbuslabs.example", expertise_text="HR policies, leave, payroll questions, onboarding paperwork", topics=["hr", "payroll", "leave"]),
            Contact(workspace_id=nimbus.id, name="Payroll", role="Finance", email="payroll@nimbuslabs.example", expertise_text="Payroll, reimbursements, expenses, timesheets", topics=["payroll", "expenses"]),
            Contact(workspace_id=nimbus.id, name="Security", role="Security", email="security@nimbuslabs.example", expertise_text="Security policy, MFA, phishing, incident reporting", topics=["security", "mfa", "phishing"]),
            Contact(workspace_id=nimbus.id, name="Engineering Manager", role="Engineering", email="engmanager@nimbuslabs.example", expertise_text="Engineering onboarding, role setup, team processes, first tasks", topics=["engineering", "team", "setup"]),
            Contact(workspace_id=nimbus.id, name="Design Lead", role="Design", email="designlead@nimbuslabs.example", expertise_text="Design systems, Figma, product processes, design onboarding", topics=["design", "figma", "process"]),
            Contact(workspace_id=nimbus.id, name="Office Admin", role="Operations", email="office@nimbuslabs.example", expertise_text="Office access, facilities, travel, desk setup", topics=["office", "facilities", "travel"]),
            Contact(workspace_id=nimbus.id, name="Finance", role="Finance", email="finance@nimbuslabs.example", expertise_text="Expense reports, reimbursements, finance tasks", topics=["finance", "reimbursements"]),
        ]
        session.add_all(contacts)
        session.commit()

        docs = [
            Document(workspace_id=nimbus.id, title="employee_handbook.md", source_type="upload", mime="text/markdown", visibility="all", tags=["policy", "onboarding"], status="ready"),
            Document(workspace_id=nimbus.id, title="it_and_access_guide.md", source_type="upload", mime="text/markdown", visibility="all", tags=["access", "it"], status="ready"),
            Document(workspace_id=nimbus.id, title="leave_and_payroll.md", source_type="upload", mime="text/markdown", visibility="all", tags=["hr", "payroll"], status="ready"),
            Document(workspace_id=nimbus.id, title="engineering_setup.md", source_type="upload", mime="text/markdown", visibility="all", tags=["engineering", "setup"], status="ready"),
            Document(workspace_id=nimbus.id, title="security_policy.md", source_type="upload", mime="text/markdown", visibility="all", tags=["security"], status="ready"),
            Document(workspace_id=nimbus.id, title="tools_overview.md", source_type="upload", mime="text/markdown", visibility="all", tags=["tools"], status="ready"),
        ]
        session.add_all(docs)
        session.commit()

        seed_text = {
            "employee_handbook.md": "Welcome to Nimbus Labs. Your first week should start with SSO, laptop setup, and HR paperwork. Please review our employee handbook and complete the onboarding checklist before your first team meeting.",
            "it_and_access_guide.md": "VPN access requires your manager approval and MFA enrollment. To request access, open the IT portal and submit the VPN request form. The default onboarding path includes SSO and repo access.",
            "leave_and_payroll.md": "Annual leave requests are submitted in the HR system. Payroll is processed on the 25th of each month, and timesheets are due every Friday.",
            "engineering_setup.md": "Developers need GitHub access, a laptop, and local environment setup. Request repo access only after SSO and MFA are complete.",
            "security_policy.md": "Security policy requires strong passwords and MFA. Do not share your access tokens or credentials. Report unusual activity to the security team.",
            "tools_overview.md": "Common tools include Slack, GitHub, Sentry, Figma, and Jira. Use SSO to access them and follow the access request process for each tool.",
        }

        for d in docs:
            text = seed_text.get(d.title, "Default onboarding text.")
            session.add(Chunk(document_id=d.id, ordinal=1, section_path="overview", page=1, text=text, token_count=max(1, len(text.split()))))

        for doc in docs:
            if doc.title == "employee_handbook.md":
                session.add(Task(user_id=alex.id, title="Complete HR onboarding", why="Required before payroll and access checks.", type="admin", est_minutes=20, due_date=datetime.utcnow(), contact_id=contacts[1].id, depends_on_json=[]))
                session.add(Task(user_id=alex.id, title="Get SSO and VPN", why="This unlocks your laptop and remote access.", type="access", est_minutes=30, due_date=datetime.utcnow(), contact_id=contacts[0].id, depends_on_json=[]))
                session.add(Task(user_id=alex.id, title="Request repo access", why="You need repo access to begin the team task.", type="access", est_minutes=25, due_date=datetime.utcnow(), contact_id=contacts[4].id, depends_on_json=[1]))

        session.commit()
        return {"seeded": True, "workspaces": [nimbus.name, robotics.name]}


if __name__ == "__main__":
    print(seed_database())
