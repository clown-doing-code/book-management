import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const WelcomeEmail = () => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        ¡Bienvenido a BookWise! Tu biblioteca digital te está esperando.
      </Preview>
      <Container style={container}>
        <Section style={box}>
          <Img src="/icons/logo.svg" width="120" height="40" alt="BookWise" />
          <Hr style={hr} />
          <Text style={paragraph}>
            ¡Gracias por unirte a BookWise! Tu cuenta ha sido creada
            exitosamente.
          </Text>
          <Text style={paragraph}>
            Aún faltan algunos pasos para activar completamente tu perfil:
            verifica tu dirección de correo electrónico y espera la aprobación
            final por parte de nuestro equipo. Te notificaremos cuando todo esté
            listo.
          </Text>
          <Text style={paragraph}>
            Mientras tanto, ya puedes comenzar a explorar nuestra extensa
            colección de libros digitales y disfrutar del préstamo de ejemplares
            disponibles en el catálogo.
          </Text>
          <Text style={paragraph}>
            <em>
              "Siempre imaginé que el Paraíso sería algún tipo de biblioteca"
            </em>{" "}
            - Jorge Luis Borges
          </Text>
          <Text style={paragraph}>
            Desde tu panel personal podrás buscar libros, realizar préstamos,
            renovar tus lecturas actuales y descubrir nuevas recomendaciones
            basadas en tus gustos literarios.
          </Text>
          <Button style={button} href="https://bookwise.com/dashboard">
            Explorar mi Biblioteca
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            Si es tu primera vez usando BookWise, te recomendamos revisar
            nuestra{" "}
            <Link style={anchor} href="https://bookwise.com/guia-usuario">
              guía de usuario
            </Link>{" "}
            para aprovechar al máximo todas las funcionalidades.
          </Text>
          <Text style={paragraph}>
            Recuerda que puedes tener hasta{" "}
            <Link style={anchor} href="https://bookwise.com/politicas-prestamo">
              5 libros prestados simultáneamente
            </Link>{" "}
            y cada préstamo tiene una duración de 14 días, con posibilidad de
            renovación. También puedes crear{" "}
            <Link style={anchor} href="https://bookwise.com/listas-lectura">
              listas de lectura personalizadas
            </Link>{" "}
            y compartirlas con otros lectores.
          </Text>
          <Text style={paragraph}>
            Para comenzar, te sugerimos explorar nuestras{" "}
            <Link
              style={anchor}
              href="https://bookwise.com/colecciones-destacadas"
            >
              colecciones destacadas
            </Link>{" "}
            que incluyen bestsellers, clásicos de la literatura y novedades
            recién agregadas a nuestro catálogo.
          </Text>
          <Text style={paragraph}>
            Estamos aquí para ayudarte en tu viaje literario. Si tienes alguna
            pregunta o necesitas asistencia, puedes contactarnos a través de
            nuestro{" "}
            <Link style={anchor} href="https://bookwise.com/soporte">
              centro de ayuda
            </Link>
            .
          </Text>
          <Text style={paragraph}>
            ¡Feliz lectura!
            <br />— El equipo de BookWise
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            BookWise, Av. de los Libros 123, Ciudad Literaria, CP 12345
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#f8f6f0",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#d4c5a9",
  margin: "20px 0",
};

const paragraph = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#8b4513",
};

const button = {
  backgroundColor: "#8b4513",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
