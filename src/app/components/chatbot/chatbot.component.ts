import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
  time: string;
  options?: string[];
}

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styles: ``
})
export class ChatbotComponent {
  isOpen = signal(false);
  isMinimized = signal(false);
  userInput = '';
  isTyping = signal(false);

  messages = signal<ChatMessage[]>([
    {
      from: 'bot',
      text: '🌍 Bonjour et bienvenue sur Sénégal Excursions ! Je suis Aminata, votre assistante virtuelle. Comment puis-je vous aider à préparer votre séjour au Sénégal ?',
      time: this.now(),
      options: ['🗺️ Nos excursions', '🚗 Notre flotte', '💰 Tarifs & réservation', '📍 Destinations', '📞 Contacter un conseiller']
    }
  ]);

  private faqMap: Record<string, { text: string; options?: string[] }> = {
    '🗺️ Nos excursions': {
      text: '✨ Nous proposons une large gamme d\'excursions adaptées à tous les profils de voyageurs :\n\n• 🏙️ Découverte de Dakar & Île de Gorée\n• 🌊 Safari dans le Sine-Saloum\n• 🌸 Lac Rose (Lac Retba)\n• 🦒 Réserve de Bandia\n• 🏛️ Saint-Louis, l\'Ancienne Capitale\n• 🌿 Aventure en Casamance\n\nQuelle destination vous intéresse ?',
      options: ['🏙️ Dakar & Gorée', '🌿 Casamance', '🦒 Safari Bandia', '🌸 Lac Rose', '⬅️ Retour au menu']
    },
    '🚗 Notre flotte': {
      text: '🚗 Notre flotte de véhicules est entièrement dédiée à votre confort et sécurité :\n\n• 🛻 4x4 Land Cruiser — Idéal pour les safaris et pistes\n• 🚌 Minibus Climatisé — Parfait pour les groupes (jusqu\'à 20 personnes)\n• 🚤 Pirogue Motorisée — Pour explorer les bolongs et le Lac Rose\n\nTous nos véhicules sont climatisés, assurés et conduits par des chauffeurs professionnels certifiés.',
      options: ['📸 Voir les photos', '💰 Tarifs & réservation', '⬅️ Retour au menu']
    },
    '💰 Tarifs & réservation': {
      text: '💰 Nos tarifs démarrent à partir de 15 000 FCFA par personne selon la destination :\n\n• Lac Rose : 15 000 FCFA/pers\n• Bandia Safari : 35 000 FCFA/pers\n• Dakar & Gorée : 25 000 FCFA/pers\n• Saint-Louis : 45 000 FCFA/pers\n• Casamance : 75 000 FCFA/pers\n\nVous pouvez réserver directement en ligne ou appeler le +221 77 000 00 00.',
      options: ['📅 Réserver maintenant', '📞 Contacter un conseiller', '⬅️ Retour au menu']
    },
    '📍 Destinations': {
      text: '📍 Nous couvrons toutes les grandes régions touristiques du Sénégal :\n\n• 🏙️ Dakar & Presqu\'île du Cap-Vert\n• 🏛️ Saint-Louis du Sénégal (UNESCO)\n• 🌿 Casamance & Cap Skirring\n• 🦒 Réserve de Bandia (Thiès)\n• 🌊 Delta du Sine-Saloum\n• 🌸 Lac Rose (Rufisque)\n\nToutes les excursions incluent un guide local certifié.',
      options: ['🗺️ Nos excursions', '💰 Tarifs & réservation', '⬅️ Retour au menu']
    },
    '📞 Contacter un conseiller': {
      text: '📞 Notre équipe est disponible 7j/7 pour vous accompagner !\n\n• 📱 Téléphone : +221 77 000 00 00\n• 📧 Email : contact@senegal-excursions.sn\n• 🕐 Horaires : 8h00 - 20h00\n• 💬 WhatsApp disponible au même numéro\n\nUn conseiller vous rappellera dans les 30 minutes !',
      options: ['📅 Réserver maintenant', '⬅️ Retour au menu']
    },
    '🏙️ Dakar & Gorée': {
      text: '🏙️ Dakar & Île de Gorée — 25 000 FCFA/pers · 8 heures\n\nUne plongée fascinante dans l\'histoire et la culture. Monument de la Renaissance, phare des Mamelles, marchés colorés et l\'Île de Gorée classée UNESCO. Départ à 8h depuis votre hôtel.',
      options: ['📅 Réserver cette excursion', '🗺️ Voir d\'autres excursions', '⬅️ Retour au menu']
    },
    '🌿 Casamance': {
      text: '🌿 Aventure en Casamance — 75 000 FCFA/pers · 2 jours\n\nExplorez la beauté luxuriante du sud du Sénégal : bolongs, pirogues, communautés locales et plages immaculées de Cap Skirring. Transport en 4x4 climatisé inclus.',
      options: ['📅 Réserver cette excursion', '🗺️ Voir d\'autres excursions', '⬅️ Retour au menu']
    },
    '🦒 Safari Bandia': {
      text: '🦒 Réserve de Bandia — 35 000 FCFA/pers · 5 heures\n\nVivez un vrai safari africain ! Girafes, rhinocéros, antilopes autour des majestueux baobabs. Notre 4x4 Land Cruiser vous emmène au cœur de la savane sénégalaise.',
      options: ['📅 Réserver cette excursion', '🗺️ Voir d\'autres excursions', '⬅️ Retour au menu']
    },
    '🌸 Lac Rose': {
      text: '🌸 Lac Rose (Lac Retba) — 15 000 FCFA/pers · 6 heures\n\nDécouvrez l\'un des sites les plus photographiés du Sénégal. Couleur rose unique, récolteurs de sel et balade en pirogue sur ce lac magique. Idéal en famille !',
      options: ['📅 Réserver cette excursion', '🗺️ Voir d\'autres excursions', '⬅️ Retour au menu']
    },
    '📸 Voir les photos': {
      text: '📸 Rendez-vous sur notre page Excursions pour voir des photos de nos véhicules en action !\n\nVous pouvez aussi consulter la section "Notre Flotte" sur la page d\'accueil.',
      options: ['💰 Tarifs & réservation', '📅 Réserver maintenant', '⬅️ Retour au menu']
    },
    '📅 Réserver maintenant': {
      text: '📅 Pour réserver, cliquez sur le bouton ci-dessous pour accéder à la page des excursions et choisir votre aventure ! Notre équipe confirmera votre réservation sous 2 heures.',
      options: ['📞 Contacter un conseiller', '⬅️ Retour au menu']
    },
    '📅 Réserver cette excursion': {
      text: '✅ Super choix ! Rendez-vous sur la page Excursions pour finaliser votre réservation. Vous pouvez aussi appeler le +221 77 000 00 00 et notre équipe s\'occupera de tout !',
      options: ['🗺️ Voir d\'autres excursions', '⬅️ Retour au menu']
    },
    '⬅️ Retour au menu': {
      text: '😊 Voici à nouveau comment je peux vous aider :',
      options: ['🗺️ Nos excursions', '🚗 Notre flotte', '💰 Tarifs & réservation', '📍 Destinations', '📞 Contacter un conseiller']
    },
    '🗺️ Voir d\'autres excursions': {
      text: '✨ Voici toutes nos destinations disponibles :',
      options: ['🏙️ Dakar & Gorée', '🌿 Casamance', '🦒 Safari Bandia', '🌸 Lac Rose', '⬅️ Retour au menu']
    }
  };

  toggleChat() {
    this.isOpen.update(v => !v);
    this.isMinimized.set(false);
  }

  closeChat() {
    this.isOpen.set(false);
  }

  now(): string {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  selectOption(option: string) {
    this.addMessage({ from: 'user', text: option, time: this.now() });
    this.isTyping.set(true);

    setTimeout(() => {
      const response = this.faqMap[option];
      this.isTyping.set(false);
      if (response) {
        this.addMessage({ from: 'bot', text: response.text, time: this.now(), options: response.options });
      } else {
        this.addMessage({
          from: 'bot',
          text: '🙏 Je transmets votre demande à un conseiller. En attendant, voici nos principales rubriques :',
          time: this.now(),
          options: ['🗺️ Nos excursions', '🚗 Notre flotte', '💰 Tarifs & réservation', '📞 Contacter un conseiller']
        });
      }
    }, 900);
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    const text = this.userInput.trim();
    this.userInput = '';
    this.addMessage({ from: 'user', text, time: this.now() });
    this.isTyping.set(true);

    setTimeout(() => {
      this.isTyping.set(false);
      const lower = text.toLowerCase();
      let reply: { text: string; options?: string[] };

      if (lower.includes('excursion') || lower.includes('visite') || lower.includes('circuit')) {
        reply = this.faqMap['🗺️ Nos excursions'];
      } else if (lower.includes('voiture') || lower.includes('véhicule') || lower.includes('transport') || lower.includes('flotte')) {
        reply = this.faqMap['🚗 Notre flotte'];
      } else if (lower.includes('prix') || lower.includes('tarif') || lower.includes('réserv') || lower.includes('cout')) {
        reply = this.faqMap['💰 Tarifs & réservation'];
      } else if (lower.includes('destination') || lower.includes('région') || lower.includes('where')) {
        reply = this.faqMap['📍 Destinations'];
      } else if (lower.includes('contact') || lower.includes('appel') || lower.includes('téléphone') || lower.includes('whatsapp')) {
        reply = this.faqMap['📞 Contacter un conseiller'];
      } else if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello')) {
        reply = { text: '😊 Bonjour ! Je suis Aminata, ravie de vous accueillir ! Comment puis-je vous aider aujourd\'hui ?', options: ['🗺️ Nos excursions', '🚗 Notre flotte', '💰 Tarifs & réservation', '📍 Destinations', '📞 Contacter un conseiller'] };
      } else {
        reply = { text: '🙏 Merci pour votre question ! Pour vous donner la meilleure réponse, voici comment je peux vous guider :', options: ['🗺️ Nos excursions', '🚗 Notre flotte', '💰 Tarifs & réservation', '📞 Contacter un conseiller'] };
      }

      this.addMessage({ from: 'bot', text: reply.text, time: this.now(), options: reply.options });
    }, 1000);
  }

  private addMessage(msg: ChatMessage) {
    this.messages.update(msgs => [...msgs, msg]);
    setTimeout(() => {
      const container = document.querySelector('.chatbot-messages');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }
}
