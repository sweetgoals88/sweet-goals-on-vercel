// En un nuevo archivo, por ejemplo /app/api/prototypes/route.ts

import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { authenticateUser } from "../../lib/authenticate-user";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { PrototypeEntity } from "../../db/entities/prototype-entity";
import { doc, documentId, getDocs, query, updateDoc, where } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { NextRequest, NextResponse } from "next/server";
// Interfaz para los datos de la tabla
interface PrototypeTableRow {
  id: string;
  key: string;
  operational: boolean;
  activationCode: string;
  version: string;
  owner: string;
}

// GET - Listar prototipos para la tabla
export async function GET() {
  try {
    const userSnapshot = await authenticateUser(
      () => cookies(),
      {}
    );
    
    const user = userSnapshot.data();
    
    // Verificar si el usuario existe y tiene permisos
    if (!user || (user.type !== "admin" && user.type !== "customer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    let prototypesSnapshot;
    
    if (user.type === "admin") {
      // Admin puede ver todos los prototipos
      prototypesSnapshot = await getDocs(FirebaseConfiguration.PROTOTYPE);
    } else {
      // Cliente solo ve sus prototipos
      const customerPrototypeIds = user.prototypes || [];
      if (customerPrototypeIds.length === 0) {
        return NextResponse.json({ prototypes: [] });
      }
      
      // Obtener los prototipos del cliente
      prototypesSnapshot = await getDocs(
        query(
          FirebaseConfiguration.PROTOTYPE,
          where(documentId(), "in", customerPrototypeIds)
        )
      );
    }
    
    // Formatear datos para la tabla
    const prototypes: PrototypeTableRow[] = prototypesSnapshot.docs.map(doc => {
      const prototype = doc.data() as PrototypeEntity;
      return {
        id: doc.id,
        key: prototype.key,
        operational: prototype.operational,
        activationCode: prototype.activation_code,
        version: prototype.version_id,
        owner: prototype.user_customization?.label || "N/A"
      };
    });
    
    return NextResponse.json({ prototypes });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener prototipos", details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}

// PATCH - Desactivar un prototipo
export async function PATCH(request: NextRequest) {
  try {
    const userSnapshot = await authenticateUser(
      () => cookies(),
      {}
    );
    
    const user = userSnapshot.data();
    
    // Verificar permisos
    if (!user || (user.type !== "admin" && user.type !== "customer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const data = await request.json();
    const prototypeId = data.prototypeId;
    const active = data.active;
    
    if (!prototypeId) {
      return NextResponse.json({ error: "ID de prototipo requerido" }, { status: 400 });
    }
    
    // Si es cliente, verificar que el prototipo le pertenezca
    if (user.type === "customer") {
      const customerPrototypeIds = user.prototypes || [];
      if (!customerPrototypeIds.includes(prototypeId)) {
        return NextResponse.json({ error: "No tienes permisos para modificar este prototipo" }, { status: 403 });
      }
    }
    
    // Actualizar el estado del prototipo
    const prototypeRef = doc(FirebaseConfiguration.PROTOTYPE, prototypeId);
    await updateDoc(prototypeRef, {
      active: Boolean(active)
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el prototipo", details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado operacional de un prototipo
export async function PUT(request: NextRequest) {
  try {
    const userSnapshot = await authenticateUser(
      () => cookies(),
      {}
    );
    
    const user = userSnapshot.data();
    
    // Verificar permisos
    if (!user || (user.type !== "admin" && user.type !== "customer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const data = await request.json();
    const prototypeId = data.prototypeId;
    const operational = data.operational;
    
    if (!prototypeId) {
      return NextResponse.json({ error: "ID de prototipo requerido" }, { status: 400 });
    }
    
    // Si es cliente, verificar que el prototipo le pertenezca
    if (user.type === "customer") {
      const customerPrototypeIds = user.prototypes || [];
      if (!customerPrototypeIds.includes(prototypeId)) {
        return NextResponse.json({ error: "No tienes permisos para modificar este prototipo" }, { status: 403 });
      }
    }
    
    // Actualizar el estado operacional del prototipo
    const prototypeRef = doc(FirebaseConfiguration.PROTOTYPE, prototypeId);
    await updateDoc(prototypeRef, {
      operational: Boolean(operational)
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el estado operacional del prototipo", details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}