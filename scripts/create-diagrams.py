#!/usr/bin/env python3
"""
HeadForge Diagram Generator
Creates architecture and user flow diagrams for the project
"""

import os
import sys
from pathlib import Path

def create_architecture_diagram():
    """Create architecture diagram using Mermaid syntax"""
    
    mermaid_content = """
graph TB
    subgraph "HeadForge Extension"
        subgraph "User Interface"
            A[Popup Interface<br/>- Form Input<br/>- Real-time Preview<br/>- Export Options]
            B[Options Page<br/>- Settings<br/>- Preferences<br/>- Theme Config]
        end
        
        subgraph "Core Logic"
            C[Background Script<br/>- Service Worker<br/>- Message Handler<br/>- Storage Manager]
            D[Content Scripts<br/>- Editor Integration<br/>- DOM Manipulation<br/>- Code Insertion]
        end
        
        subgraph "Utilities"
            E[Template Engine<br/>- Header Generation<br/>- Language Support<br/>- Formatting]
            F[Validation<br/>- Input Validation<br/>- Data Sanitization<br/>- Error Handling]
            G[Storage Utils<br/>- Local Storage<br/>- Settings Management<br/>- Preferences]
        end
        
        subgraph "Data Layer"
            H[Language Configs<br/>- 25+ Languages<br/>- Comment Syntax<br/>- Templates]
            I[User Settings<br/>- Preferences<br/>- Theme<br/>- Defaults]
            J[Header Data<br/>- Form Input<br/>- Generated Content<br/>- Export Options]
        end
    end
    
    subgraph "External Systems"
        K[Browser APIs<br/>- Storage API<br/>- Clipboard API<br/>- File API]
        L[Web Pages<br/>- Code Editors<br/>- Development Tools<br/>- IDEs]
    end
    
    %% User interactions
    A --> E
    A --> F
    A --> G
    B --> G
    B --> I
    
    %% Core logic connections
    C --> E
    C --> F
    C --> G
    D --> E
    D --> L
    
    %% Data flow
    E --> H
    F --> J
    G --> I
    G --> J
    
    %% External connections
    C --> K
    D --> K
    A --> K
    
    %% Styling
    classDef ui fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef core fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef utils fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef data fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef external fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    
    class A,B ui
    class C,D core
    class E,F,G utils
    class H,I,J data
    class K,L external
"""
    
    # Save to file
    diagram_path = Path("docs/assets/architecture-diagram.mmd")
    diagram_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(diagram_path, "w", encoding="utf-8") as f:
        f.write(mermaid_content.strip())
    
    print(f"✅ Architecture diagram created: {diagram_path}")
    
    # Also create a simplified version
    simple_mermaid = """
graph LR
    A[User] --> B[Popup Interface]
    B --> C[Template Engine]
    C --> D[Language Configs]
    C --> E[Generated Header]
    E --> F[Export Options]
    F --> G[Clipboard/File/Editor]
    
    B --> H[Settings]
    H --> I[Storage]
    I --> J[Preferences]
    
    classDef user fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef ui fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef core fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef data fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class A user
    class B,H ui
    class C,F core
    class D,E,I,J data
"""
    
    simple_path = Path("docs/assets/architecture-simple.mmd")
    with open(simple_path, "w", encoding="utf-8") as f:
        f.write(simple_mermaid.strip())
    
    print(f"✅ Simple architecture diagram created: {simple_path}")

def create_user_flow_diagram():
    """Create user flow diagram using Mermaid syntax"""
    
    mermaid_content = """
graph TD
    A[User Opens Extension] --> B{First Time?}
    B -->|Yes| C[Show Welcome Message]
    B -->|No| D[Load Previous Settings]
    
    C --> E[User Fills Form]
    D --> E
    
    E --> F[Select Programming Language]
    F --> G[Fill Project Details]
    G --> H[Configure Additional Settings]
    H --> I[Real-time Preview Updates]
    
    I --> J{User Satisfied?}
    J -->|No| K[Modify Form Fields]
    K --> I
    J -->|Yes| L[Generate Header]
    
    L --> M{Export Option?}
    M -->|Copy| N[Copy to Clipboard]
    M -->|Download| O[Download File]
    M -->|Insert| P[Insert into Editor]
    
    N --> Q[Show Success Message]
    O --> Q
    P --> Q
    
    Q --> R{Continue?}
    R -->|Yes| S[Clear Form/New Header]
    R -->|No| T[Close Extension]
    
    S --> E
    
    %% Error handling
    E --> U{Validation Error?}
    U -->|Yes| V[Show Error Message]
    V --> E
    U -->|No| F
    
    %% Settings flow
    E --> W[User Opens Settings]
    W --> X[Configure Preferences]
    X --> Y[Save Settings]
    Y --> Z[Return to Main Interface]
    Z --> E
    
    %% Theme switching
    E --> AA[User Toggles Theme]
    AA --> BB[Update UI Theme]
    BB --> E
    
    %% Styling
    classDef start fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef action fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef end fill:#e0f2f1,stroke:#00695c,stroke-width:3px
    
    class A start
    class E,F,G,H,I,L,N,O,P,X,Y,BB process
    class B,J,M,R,U decision
    class C,D,K,Q,S,W,Z action
    class V error
    class T end
"""
    
    # Save to file
    diagram_path = Path("docs/assets/user-flow.mmd")
    diagram_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(diagram_path, "w", encoding="utf-8") as f:
        f.write(mermaid_content.strip())
    
    print(f"✅ User flow diagram created: {diagram_path}")
    
    # Also create a simplified version
    simple_flow = """
graph LR
    A[Open Extension] --> B[Fill Form]
    B --> C[Select Language]
    C --> D[Preview Header]
    D --> E{Happy?}
    E -->|No| B
    E -->|Yes| F[Export]
    F --> G[Copy/Download/Insert]
    G --> H[Success!]
    
    classDef start fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px
    classDef process fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef end fill:#e0f2f1,stroke:#00695c,stroke-width:3px
    
    class A start
    class B,C,D,F,G process
    class E decision
    class H end
"""
    
    simple_path = Path("docs/assets/user-flow-simple.mmd")
    with open(simple_path, "w", encoding="utf-8") as f:
        f.write(simple_flow.strip())
    
    print(f"✅ Simple user flow diagram created: {simple_path}")

def create_data_flow_diagram():
    """Create data flow diagram"""
    
    mermaid_content = """
graph TB
    subgraph "Input Layer"
        A[User Form Input]
        B[Settings/Preferences]
        C[Language Selection]
    end
    
    subgraph "Processing Layer"
        D[Input Validation]
        E[Data Sanitization]
        F[Template Processing]
        G[Language Configuration]
    end
    
    subgraph "Storage Layer"
        H[Local Storage]
        I[User Preferences]
        J[Language Configs]
    end
    
    subgraph "Output Layer"
        K[Generated Header]
        L[Preview Display]
        M[Export Options]
    end
    
    subgraph "External Layer"
        N[Clipboard API]
        O[File Download]
        P[Editor Insertion]
    end
    
    %% Data flow
    A --> D
    B --> I
    C --> G
    
    D --> E
    E --> F
    F --> G
    G --> J
    
    I --> H
    J --> H
    
    F --> K
    K --> L
    K --> M
    
    M --> N
    M --> O
    M --> P
    
    %% Styling
    classDef input fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef process fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef storage fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef output fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef external fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class A,B,C input
    class D,E,F,G process
    class H,I,J storage
    class K,L,M output
    class N,O,P external
"""
    
    diagram_path = Path("docs/assets/data-flow.mmd")
    diagram_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(diagram_path, "w", encoding="utf-8") as f:
        f.write(mermaid_content.strip())
    
    print(f"✅ Data flow diagram created: {diagram_path}")

def create_component_diagram():
    """Create component relationship diagram"""
    
    mermaid_content = """
graph TB
    subgraph "HeadForge Extension"
        subgraph "UI Components"
            A[Popup Interface]
            B[Options Page]
            C[Settings Pages]
        end
        
        subgraph "Core Services"
            D[Template Engine]
            E[Validation Service]
            F[Storage Service]
            G[Theme Service]
        end
        
        subgraph "Utilities"
            H[Date Utils]
            I[Clipboard Utils]
            J[File Utils]
            K[Language Utils]
        end
        
        subgraph "Data Models"
            L[Header Data]
            M[Language Config]
            N[User Settings]
            O[Theme Config]
        end
    end
    
    %% Component relationships
    A --> D
    A --> E
    A --> F
    A --> G
    
    B --> F
    B --> G
    C --> F
    
    D --> K
    D --> L
    D --> M
    
    E --> L
    F --> N
    G --> O
    
    A --> H
    A --> I
    A --> J
    
    %% Styling
    classDef ui fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef service fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef util fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef data fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class A,B,C ui
    class D,E,F,G service
    class H,I,J,K util
    class L,M,N,O data
"""
    
    diagram_path = Path("docs/assets/component-diagram.mmd")
    diagram_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(diagram_path, "w", encoding="utf-8") as f:
        f.write(mermaid_content.strip())
    
    print(f"✅ Component diagram created: {diagram_path}")

def create_deployment_diagram():
    """Create deployment and CI/CD diagram"""
    
    mermaid_content = """
graph TB
    subgraph "Development"
        A[Developer]
        B[Local Development]
        C[Git Repository]
    end
    
    subgraph "CI/CD Pipeline"
        D[GitHub Actions]
        E[Code Quality Check]
        F[Build Process]
        G[Testing]
        H[Security Scan]
    end
    
    subgraph "Build Outputs"
        I[Chrome Package]
        J[Firefox Package]
        K[Edge Package]
        L[Universal Package]
    end
    
    subgraph "Distribution"
        M[Chrome Web Store]
        N[Firefox Add-ons]
        O[Edge Add-ons]
        P[GitHub Releases]
    end
    
    subgraph "Users"
        Q[Chrome Users]
        R[Firefox Users]
        S[Edge Users]
        T[Manual Install]
    end
    
    %% Flow
    A --> B
    B --> C
    C --> D
    
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    H --> J
    H --> K
    H --> L
    
    I --> M
    J --> N
    K --> O
    L --> P
    
    M --> Q
    N --> R
    O --> S
    P --> T
    
    %% Styling
    classDef dev fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef pipeline fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef build fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef dist fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef user fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class A,B,C dev
    class D,E,F,G,H pipeline
    class I,J,K,L build
    class M,N,O,P dist
    class Q,R,S,T user
"""
    
    diagram_path = Path("docs/assets/deployment-diagram.mmd")
    diagram_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(diagram_path, "w", encoding="utf-8") as f:
        f.write(mermaid_content.strip())
    
    print(f"✅ Deployment diagram created: {diagram_path}")

def main():
    """Main function to create all diagrams"""
    print("🎨 Creating HeadForge diagrams...")
    print("=" * 40)
    
    try:
        create_architecture_diagram()
        create_user_flow_diagram()
        create_data_flow_diagram()
        create_component_diagram()
        create_deployment_diagram()
        
        print("\n✅ All diagrams created successfully!")
        print("\n📋 Generated files:")
        print("  • docs/assets/architecture-diagram.mmd")
        print("  • docs/assets/architecture-simple.mmd")
        print("  • docs/assets/user-flow.mmd")
        print("  • docs/assets/user-flow-simple.mmd")
        print("  • docs/assets/data-flow.mmd")
        print("  • docs/assets/component-diagram.mmd")
        print("  • docs/assets/deployment-diagram.mmd")
        
        print("\n💡 To convert to images, use:")
        print("  • Mermaid CLI: mmdc -i diagram.mmd -o diagram.png")
        print("  • Online: https://mermaid.live/")
        print("  • VS Code: Mermaid Preview extension")
        
    except Exception as error:
        print(f"❌ Error creating diagrams: {error}")
        sys.exit(1)

if __name__ == "__main__":
    main()
