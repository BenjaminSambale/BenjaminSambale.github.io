const images = [
            { title: "San Francisco", src: "earlySF.jpg" },
            { title: "San Francisco", src: "coitTower.jpg" },
            { title: "San Francisco (seen from Berkeley)", src: "SanFran.jpg" },
            { title: "Golden Gate Bridge seen from Berkeley", src: "goldenGate.jpg" },
            { title: "Its Beach (Santa Cruz)", src: "SCarch.jpg" },
            { title: "Seabright Beach (Santa Cruz)", src: "seagull.jpg" },
            { title: "Natural Bridges (Sanat Cruz)", src: "naturalBridges.jpg" },
            { title: "Capitola (California)", src: "capitola.jpg" },
            { title: "SS Palo Alto (Monterey Bay)", src: "paloAlto.jpg" },
            { title: "Gray whale (Monterey Bay)", src: "whalefin.jpg" },
            { title: "Pfeiffer Beach (Big Sur)", src: "bigsur.jpg" },
            { title: "Pillar point (Half moon bay)", src: "halfmoonbay.jpg" },
            { title: "Sequoia national park", src: "backflipSequoia.jpg" },
            { title: "Carmel river beach", src: "backflipCarmel.jpg" },
            { title: "Lake Tahoe", src: "lakeTahoe.jpg" },
            // { title: "St Heliers Beach (Auckland)", src: "brauerSuzuki.jpg" },
            { title: "Piha South Beach (New Zealand)", src: "pihasouth.jpg" },
            { title: "Mount Rundle (Banff)", src: "mtrundle.jpg" },
            { title: "Bristol Marina", src: "bristol.jpg" },
            { title: "Copenhagen", src: "copenhagen.jpg" },
            { title: "Gdansk (Poland)", src: "danzig.jpg" },
            { title: "Hemisferic (Valencia)", src: "hemispheric.jpg" },
            // { title: "Port Saplaya (Valencia)", src: "valencia.jpg" },
            { title: "Castillo (Alicante)", src: "alicante.jpg" },
            { title: "Palma de Mallorca", src: "bellver.jpg" },
            { title: "Quarteira (Algarve)", src: "quarteira.jpg" },
            { title: "Espinho", src: "espinho.jpg" },
            { title: "Lisbon", src: "lisbon.jpg" },
            { title: "Porto", src: "porto.jpg" }, 
            { title: "Lake Geneva (Lausanne)", src: "wein.jpg" },
            { title: "Lake Geneva (Lausanne)", src: "lausanne.jpg" },
            { title: "Paris (from Eiffel tower)", src: "paris.jpg" },
            { title: "Malta", src: "malta.jpg" },
            { title: "10m platform in Croatia", src: "10m.jpg" },
            { title: "16m cliff in Croatia", src: "croatiaCliff.jpg" },
            { title: "Hvar (Croatia)", src: "hvar.jpg" },
            { title: "Crete", src: "crete.jpg" },
            { title: "Wustrow (Baltic Sea)", src: "ostsee.jpg" },
            { title: "Weststrand (Baltic Sea)", src: "weststrand.jpg" },
            { title: "Amber at the Baltic Sea", src: "bernstein.jpg" },
            { title: "Norderney (North Sea)", src: "norderney.jpg" },
            { title: "Norderney (North Sea)", src: "seals.jpg" },
            { title: "Juist (North Sea)", src: "juist.jpg" },
            { title: "Göttingen", src: "goettingen.jpg" },
            { title: "Saale (Jena Lichtenhain)", src: "lichtenhain.jpg" },
            { title: "Jena Paradies", src: "paradies.jpg" },
            // { title: "Jena Paradies", src: "slackline75m.jpg" },
            { title: "Jena Paradies", src: "slacklineRed.jpg" },
            { title: "Waterline over the Saale (Jena)", src: "waterline.jpg" },
            { title: "Hannover", src: "hannover.jpg" },
            { title: "Kaiserslautern", src: "kaiserslautern.jpg" },
        ];
        const gallery = document.getElementById('gallery');
        const lightbox = document.getElementById('lightbox');
        const lbImg = document.getElementById('lightboxImg');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const body = document.getElementById('galleryBody');

        images.forEach(({ title, src }, index) => {
            const button = document.createElement("button");
            button.title = title;
            button.dataset.index = index
            button.addEventListener('click', () => open(index))
            const img = document.createElement("img");
            img.src = "../photos/thumbs/" + src;
            img.alt = title;
            button.appendChild(img)
            gallery.appendChild(button);
        });

        let currentIndex = -1;

        function open(index) {
            lbImg.src = "../photos/" + images[index].src;
            lbImg.title = images[index].title;
            lbImg.alt = images[index].title;
            currentIndex = index;
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden';
        }

        function close() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            body.style.overflow = 'auto';
            lbImg.src = '';
            currentIndex = -1;
        }

        function showNext(delta) {
            // if (currentIndex < 0) return;
            let next = (currentIndex + delta + images.length) % images.length;
            open(next);
        }

        prevBtn.addEventListener('click', () => showNext(-1));
        nextBtn.addEventListener('click', () => showNext(1));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) {
                if (e.key === 'Escape') close();
                if (e.key === 'ArrowRight') showNext(1);
                if (e.key === 'ArrowLeft') showNext(-1);
            }
        });