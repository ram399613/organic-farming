const express = require('express');
const router = express.Router();

// Comprehensive knowledge base for the AI bot
const KNOWLEDGE_BASE = {
    'soil': [
        "Soil health is the foundation of organic farming. Focus on building <b>soil organic matter</b>.",
        "Use cover crops like clover or vetch to fix nitrogen naturally. It's like nature's own fertilizer!",
        "Healthy soil should be full of life! Avoid heavy tilling to protect the beneficial fungi and earthworms."
    ],
    'pest': [
        "Organic pest management (IPM) focuses on prevention first. Have you tried companion planting?",
        "For immediate issues, <b>neem oil</b> and insecticidal soaps are excellent chemical-free solutions.",
        "Encourage natural predators! Ladybugs and lacewings are your best friends in a sustainable garden."
    ],
    'compost': [
        "A good compost pile needs a balance of 'greens' and 'browns'. Aim for a 30:1 ratio.",
        "Keep your compost moist like a wrung-out sponge. If it smells bad, it needs more air!",
        "Vermicomposting (using worms) is one of the fastest ways to turn kitchen scraps into black gold."
    ],
    'fertilizer': [
        "Try making <b>Jeevamrutha</b> with cow dung and jaggery. It's a microbial powerhouse!",
        "Seaweed extract is a fantastic source of trace minerals that traditional fertilizers often miss.",
        "Fish emulsion and bone meal are great organic sources of nitrogen and phosphorus respectively."
    ],
    'weed': [
        "Suppress weeds naturally with a thick layer of straw or wood chip <b>mulch</b>.",
        "Remember, some 'weeds' are actually beneficial! They can bring up deep minerals with their taproots.",
        "Flame weeding is an effective organic way to clear paths and large beds before planting."
    ],
    'water': [
        "Drip irrigation is the gold standard for water conservation in organic farming.",
        "Water early in the morning to minimize evaporation and prevent fungal diseases on leaves.",
        "Harvesting rainwater is a great way to make your farm truly self-sustaining."
    ],
    'fruit': [
        "For organic fruits, airflow is key. Proper pruning prevents 90% of fungal problems.",
        "Use pheromone traps to manage fruit flies without ever touching a synthetic pesticide.",
        "Organic orchards benefit greatly from 'guild planting'—surrounding trees with helpful herbs."
    ],
    'dairy': [
        "Organic dairy is all about the grass! Cows must spend significant time grazing on open pasture.",
        "No synthetic hormones or prophylactic antibiotics here. We focus on animal welfare and natural health.",
        "Cleanliness and low-stress environments are the best ways to keep an organic herd healthy."
    ],
    'grain': [
        "Intercropping grains with legumes (like beans) is a classic way to keep the soil fertile.",
        "Heirloom grain varieties often have deeper root systems and better natural pest resistance.",
        "Focus on healthy rotations to break the cycle of grain-specific pests and diseases."
    ],
    'hello': [
        "Hello! I'm AgriBot. I've been studying the fields all day. How can I help you grow?",
        "Namaste! Ready to talk about sustainable farming? Ask me anything about your crops!",
        "Hi there! It's a great day for organic farming. What's on your mind today?"
    ],
    'help': [
        "I can help with: \n1. Soil fertility\n2. Natural pest control\n3. Organic certification\n4. Crop-specific advice.",
        "I'm trained in all things organic! Ask me about composting, water conservation, or dairy health.",
        "Need a hand? I can guide you through the transition to chemical-free farming step-by-step."
    ]
};

const DEFAULT_RESPONSES = [
    "That's a great question! In organic farming, the answer usually lies in working <b>with</b> nature rather than against it.",
    "Interesting! While I don't have a specific guide for that, I'd recommend looking into <b>biological diversity</b> as a starting point.",
    "The world of organic farming is vast! Could you try asking about soil, pests, or specific categories like fruits or dairy?"
];

router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required" });

        const msg = message.toLowerCase();
        let reply = "";

        // Context-aware logic: Check history for previous topics
        const lastUserMsg = history && history.length > 2 ? history[history.length - 3].content.toLowerCase() : "";
        
        // Comprehensive editorial-style knowledge
        const ADVICE = {
            'soil': "Building high-quality soil is an investment in your farm's future. For organic systems, I recommend a <b>no-till approach</b> combined with diverse cover crops. Have you tested your organic matter levels recently? Aiming for 5% or higher will drastically improve your water retention and nutrient cycling.",
            'pest': "When dealing with pests organically, we focus on <b>Integrated Pest Management (IPM)</b>. The first step is monitoring and identifying the pest correctly. Often, increasing biodiversity by planting 'insectary strips'—rows of flowering plants that attract predatory insects—can solve a pest problem naturally without any sprays.",
            'compost': "The 'black gold' of organic farming! A truly high-quality compost needs to reach <b>thermophilic temperatures</b> (between 131°F and 170°F) to kill weed seeds and pathogens. Ensure you're turning it regularly to maintain aerobic conditions, which encourages the most beneficial microbial life.",
            'fertilizer': "Organic nutrition is about <b>feeding the soil, not the plant</b>. While liquid fertilizers like fish emulsion provide a quick boost, long-term fertility comes from slow-release sources like composted manure, alfalfa meal, and rock dusts which provide essential trace minerals over several seasons.",
            'weed': "Weeds are often 'nature's band-aids' trying to cover bare soil. Instead of fighting them, try to out-compete them with <b>living mulches</b> or suppress them with thick organic mulches like straw. If you're seeing lots of thistle, it might be a sign that your soil is becoming too compacted.",
            'water': "Water management is critical. <b>Drip irrigation</b> buried under mulch can reduce water waste by up to 60%. Additionally, high soil organic matter acts like a giant sponge—each 1% increase in organic matter can hold an additional 20,000 gallons of water per acre!",
            'fruit': "Organic orcharding requires careful variety selection. Always choose disease-resistant cultivars adapted to your specific climate. <b>Pruning</b> is your most important tool; it ensures sunlight reaches the interior of the tree and allows airflow, which is the best defense against fungal diseases like powdery mildew.",
            'dairy': "A successful organic dairy relies on the <b>health of the pasture</b> as much as the health of the cows. Implementing 'Rotational Grazing'—where cows move to a fresh section of grass every day—mimics natural herbivore behavior, reduces parasite loads, and keeps the grass in a state of rapid, high-protein growth.",
            'grain': "Scaling organic grain production depends on complex <b>multi-year crop rotations</b>. A typical cycle might include two years of alfalfa (to build nitrogen), followed by corn, then soybeans, and finally a small grain like oats or wheat interseeded with clover to start the cycle again.",
            'certification': "The path to organic certification is a three-year transition period. During this time, you must maintain meticulous records of every seed, fertilizer, and practice you use. It's a commitment to transparency, but the <b>premium pricing</b> and environmental benefits make it highly rewarding for many farmers.",
            'hello': "Hello! I'm AgriBot, your personal consultant for sustainable and organic agriculture. I've been analyzing the latest regenerative practices all morning. What can we look into for your farm today?",
            'help': "I'm here to help you master the art of organic farming. You can ask me about: \n- **Soil Fertility** and Composting\n- **Natural Pest Management**\n- **Water Conservation** and Irrigation\n- **Specific Crops** (Fruits, Grains, Dairy)\n- **The Certification Process**\n\nHow should we begin?",
            'thanks': "You're very welcome! Successful farming is a journey of continuous learning. Remember, the best fertilizer is the farmer's footprint on the land. Is there anything else you'd like to explore?",
            'bye': "Goodbye! May your harvests be bountiful and your soil ever-improving. I'll be here whenever you need more organic advice. Happy farming! 🌱"
        };

        // Combine logic: Check for keywords
        for (const key in ADVICE) {
            if (msg.includes(key)) {
                reply = ADVICE[key];
                break;
            }
        }

        // If it's a follow-up or generic question
        if (!reply) {
            if (msg.includes('how') || msg.includes('what') || msg.includes('why')) {
                reply = "That's a sophisticated question. In organic farming, the answer usually involves understanding the <b>biological synergy</b> between your plants and the soil ecosystem. To give you a more specific answer, could you tell me more about your soil health or the specific crop you're working with?";
            } else {
                reply = "I'm processing your request using my organic farming knowledge base. While I don't have a specific guide for that yet, the general principle in organic systems is to <b>maximize biodiversity</b> and minimize external inputs. Would you like to dive deeper into soil health or pest management instead?";
            }
        }

        // Simulating the "thinking" and "processing" for the ChatGPT feel
        setTimeout(() => {
            res.json({ reply });
        }, 600);

    } catch (error) {
        console.error('AI Route Error:', error);
        res.status(500).json({ message: "AgriBot is currently surveying the digital fields. Please try again in a moment!" });
    }
});

module.exports = router;
