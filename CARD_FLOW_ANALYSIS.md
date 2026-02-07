# 🔍 Análisis Completo de Flujo de Cartas

## LEYENDA:
- ✅ = Flujo correcto y claro
- ⚠️ = Funciona pero puede mejorar claridad
- ❌ = Confuso o incorrecto

---

## VANILLA CARDS

### 1. Yakky Doodle (4 tokens) ✅
**USO (Player 1):**
- Input Modal: "Construye palabra con tus fichas"
- Elige: MUCHAS letras → forma palabra completa
- Ejemplo: "CASA"

**RESPUESTA (Player 2):**
- Ve la palabra: "CASA"
- Modal: "Selecciona letras que NO están en tu palabra"
- Respuesta: Tacha letras (ej: C, S si su palabra es "AMA")

**RESULTADO:** Player 1 ve qué letras eliminar. ✅ CLARO

---

### 2. Woody (4 tokens) ✅
**USO (Player 1):**
- Click directo, sin input
- Carta dice: "Primera letra"

**RESPUESTA (Player 2):**
- Modal: "Revela PRIMERA letra de tu palabra"
- Ve su palabra secreta: "PERRO"
- Selecciona o escribe: "P"

**RESULTADO:** Player 1 ve "P". ✅ CLARO

---

### 3. Calimero (1 token) ✅
**USO (Player 1):**
- Input Modal: "Construye palabra"
- Elige: MUCHAS letras
- Ejemplo: "GATO" (4 letras)

**RESPUESTA (Player 2):**
- Ve la palabra: "GATO"
- Ve su palabra: "ELEFANTE"
- Modal: 3 botones grandes: MÁS LARGA / MÁS CORTA / IGUAL
- Click: MÁS LARGA

**RESULTADO:** Player 1 sabe que la palabra rival es más larga. ✅ CLARO

---

### 4. José Carioca (2 tokens) ✅
**USO (Player 1):**
- Input Modal: "Elige UNA letra de tus fichas"
- Ejemplo: Click en "R"

**RESPUESTA (Player 2):**
- Ve la letra: "R"
- Ve su palabra: "PERRO"
- Modal: 2 botones: SÍ / NO
- Click: SÍ

**RESULTADO:** Player 1 sabe que "R" está. ✅ CLARO

---

### 5. Chilly Willy (3 tokens) ✅
**USO (Player 1):**
- Click directo, sin input

**RESPUESTA (Player 2):**
- Modal: "Escribe longitud exacta"
- Ve su palabra: "ELEFANTE" (8 letras)
- Escribe: "8"

**RESULTADO:** Player 1 ve "8". ✅ CLARO

---

### 6. Woodstock (1 token) ✅
**USO (Player 1):**
- Click directo, sin input

**RESPUESTA (Player 2):**
- Modal: "Revela ÚLTIMA letra"
- Ve su palabra: "PERRO"
- Selecciona o escribe: "O"

**RESULTADO:** Player 1 ve "O". ✅ CLARO

---

## SPICY CARDS

### 7. Iago (5 tokens) ⚠️
**USO (Player 1):**
- Click directo, sin input

**RESPUESTA (Player 2):**
- Modal: "Escribe palabra que RIME"
- Ve su palabra: "GATO"
- Escribe: "PATO" o "ÑATO" (inventada)

**RESULTADO:** Player 1 ve "PATO" como rima.
**ISSUE:** No hay validación de rima real. Pero OK para juego casual. ⚠️ ACEPTABLE

---

### 8. Henery Hawk (3 tokens) ⚠️
**USO (Player 1):**
- Input Modal: "Elige UNA letra"
- Ejemplo: "R"

**RESPUESTA (Player 2):**
- Ve letra: "R"
- Ve su palabra: "PERRO"
- Modal: "Si está, escribe POSICIÓN. Si no, click NO ESTÁ"
- Respuesta: "2" (segunda R en PERRO)

**RESULTADO:** Player 1 ve "Posición 2".
**ISSUE:** ¿Posición 1-indexed o 0-indexed? Debería clarificarse. ⚠️ CONFUSO

---

### 9. Zazu (1 token) ⚠️
**USO (Player 1):**
- Click directo, sin input
- **PERO:** ¿Quién revela primero? No está claro

**RESPUESTA (Player 2):**
- Modal: "Selecciona letra NO revelada de tu palabra"
- Ve su palabra: "PERRO" (nada revelado aún)
- Selecciona: "E"

**RESULTADO:** Ambos revelan una letra.
**ISSUE:** 
1. Player 1 también debe revelar una letra DE SU PROPIA palabra
2. ¿En qué momento? ¿Antes o después del modal?
3. NO ESTÁ IMPLEMENTADO que Player 1 revele la suya
❌ INCOMPLETO

---

### 10. Heckle and Jeckle (2 tokens) ⚠️
**USO (Player 1):**
- Input Modal: "Elige letra que TENGAS 2+ veces"
- Fichas: [P, E, R, R, O, T, R]
- Ejemplo: "R" (tiene 3)

**RESPUESTA (Player 2):**
- Ve letra: "R"
- Ve su palabra: "CARRO" (2 erres)
- Modal: "Escribe cuántas veces aparece (puede ser 0)"
- Escribe: "2"

**RESULTADO:** Player 1 ve "2".
**ISSUE:** Modal actual no menciona "puede ser 0". ⚠️ MEJORABLE

---

### 11. Scuttle (1 token) ❌ **PROBLEMA PRINCIPAL**
**USO (Player 1):**
- Input Modal dice: "Construye palabra..." o "Selecciona fichas..." (¡MAL!)
- Debería decir: "Elige UNA letra común a ambos sets"
- Fichas Player 1: [P, E, R, R, O]
- Fichas Player 2 (visibles): [C, A, R, O, S]
- Letras comunes: R, O
- Player 1 elige: "R"

**RESPUESTA (Player 2):**
- Ve letra: "R"
- Modal dice: "Tu oponente eligió una letra que está en AMBOS sets..."
- Ve su palabra: "PERRO"
- Escribe: "3" (PERRO tiene 3 R)

**PROBLEMA:** 
1. Input modal NO dice claramente "elige UNA letra común"
2. Muestra "Selecciona fichas" (plural) = confusión
3. No valida que la letra esté en ambos sets
❌ CONFUSO Y MAL IMPLEMENTADO

---

### 12. Foghorn Leghorn (1 token) ✅
**USO (Player 1):**
- Click directo

**RESPUESTA (Player 2):**
- Modal: "Revela UNA vocal no revelada"
- Ve su palabra: "PERRO" (vocales: E, O)
- Letras ya reveladas: ninguna
- Selecciona: "E"
- Si ninguna disponible: botón "NINGUNA"

**RESULTADO:** Player 1 ve "E". ✅ CLARO

---

### 13. Scrooge McDuck (variable) ✅
**USO (Player 1):**
- Input Modal: "Construye palabra"
- Ejemplo: "CASA"

**RESPUESTA (Player 2):**
- Ve palabra: "CASA"
- Modal: "Selecciona letras que NO están"
- Su palabra: "PERRO"
- Tacha: C, S

**RESULTADO:** 
- Letras eliminadas: C, S
- Letras que quedan: A (1)
- Coste: 2 tokens (letras que quedaron visibles)
✅ CLARO (igual que Yakky pero con coste dinámico)

---

### 14. Flit (1 token) ✅
**USO (Player 1):**
- Input Modal: "Elige letra rara: Z, J, Q, X, K"
- Dropdown o botones con esas 5 letras
- Ejemplo: "Q"

**RESPUESTA (Player 2):**
- Ve letra: "Q"
- Modal: "¿Está en tu palabra? SÍ / NO"
- Su palabra: "QUESO"
- Click: SÍ

**RESULTADO:** Player 1 ve "SÍ". ✅ CLARO

---

### 15. Beaky Buzzard (2 tokens) ✅
**USO (Player 1):**
- Click directo

**RESPUESTA (Player 2):**
- Modal: "Escribe número de VOCALES"
- Su palabra: "ELEFANTE" (4 vocales: E, E, A, E)
- Escribe: "4"

**RESULTADO:** Player 1 ve "4". ✅ CLARO

---

### 16. Daffy Duck (3 tokens) ✅
**USO (Player 1):**
- Click directo

**RESPUESTA (Player 2):**
- Modal: "Escribe número de CONSONANTES"  
- Su palabra: "ELEFANTE" (4 consonantes: L, F, N, T)
- Escribe: "4"

**RESULTADO:** Player 1 ve "4". ✅ CLARO

---

## RESUMEN DE PROBLEMAS

### ❌ CRÍTICO:
1. **Scuttle**: Input modal confuso, no dice "elige UNA letra común"
2. **Zazu**: Falta implementar que Player 1 TAMBIÉN revele letra de SU palabra

### ⚠️ MEJORABLE:
3. **Henery**: No especifica si posición es 1-indexed o 0-indexed
4. **Heckle**: No menciona "puede ser 0"
5. **Iago**: Sin validación de rima (OK para casual)

### ✅ FUNCIONAN BIEN:
- Yakky, Woody, Calimero, José, Chilly, Woodstock
- Foghorn, Scrooge, Flit, Beaky, Daffy

---

## ACCIÓN REQUERIDA

### 1. FIX SCUTTLE (CRÍTICO):
**EventModal input:**
```
Título: "Usar: Scuttle"
Mensaje: "Elige UNA letra que esté en AMBOS conjuntos de fichas (tuyas y del rival)"
UI: Mostrar solo letras comunes (intersección)
Validación: Solo permitir letras que ambos tengan
```

**CardActionModal respuesta:**
```
Contexto: "Tu oponente eligió: R"
Tu palabra: "PERRO"
Prompt: "¿Cuántas veces aparece esta letra en TU palabra?"
Input: número (0-9)
```

### 2. FIX ZAZU (CRÍTICO):
**Flujo:**
1. Player 1 usa Zazu
2. EventModal pide: "Selecciona letra NO revelada de TU palabra"
3. Player 1 selecciona "E" (de su palabra "PERRO")
4. Se envía al servidor con cardInput: "E"
5. Player 2 recibe modal: "Tu oponente reveló: E. Ahora revela tú una letra"
6. Player 2 selecciona letra de SU palabra
7. Resultado: AMBOS players ven las dos letras reveladas

### 3. MEJORAS MENORES:
- Henery: Agregar "(posición 1 = primera letra)" en prompt
- Heckle: Agregar "(escribe 0 si no aparece)" en prompt
