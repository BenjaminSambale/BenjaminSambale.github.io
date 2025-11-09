const texts = [
    "The dihedral group \\(D_8\\) is the group of symmetries of the square consisting of four rotations and four reflections. Our realization is an intransitive permutation group, since the center box is fixed. Every scramble can be solved by a sequence of at most three moves, i.e. <em>God's number</em> with respect to the given generators is 3.",

    "The quaternion group \\(Q_8\\) of order 8 acts regularly on the eight outer boxes, i.e. every non-trivial element is fixed-point-free. In fact, \\(Q_8\\) cannot be represented as a permutation group of smaller degree, i.e. <em>Cayley's theorem</em> is best possible. This group is an ingredient for \\(M_9\\) further down the list. God's number is 2.",

    "The projective special linear group \\(\\mathrm{PSL}(2,7)\\) acts faithfully and 2-transitively on the set of the eight 1-dimensional subspaces of \\(\\mathbb{F}_7^2\\) by matrix-vector-multiplication. It is the unique simple group of order 168. In particular, it is isomorphic to \\(\\mathrm{GL}(3,2)\\). God's number is 9.",

    "The projective general linear group \\(\\mathrm{PGL}(2,7)\\) of order 336 is an extension of \\(\\mathrm{PSL}(2,7)\\). God's number is 12. There are of course many other interesting permutation groups of degree 8, like \\(\\mathrm{AGL}(1,8)\\) or \\(\\mathrm{A\\Gamma L}(1,8)\\), but our focus is on the groups of degree 9.",

    "The elementary abelian group \\(C_3\\times C_3\\) of order 9 is regular. It permutes the three rows and three columns cyclically and independently. God's number is 2, as can be checked easily.",

    "In contrast to \\(C_3\\times C_3\\), the imprimitive group \\(S_3\\times S_3\\) realizes arbitrary permutations (not only cyclical) of the three rows and three columns. It has order \\((3!)^2=36\\) and god's number 6",

    "The wreath product \\(C_3\\wr C_3\\cong C_3^3\\rtimes C_3\\) of order \\(3^4=81\\) is the unique smallest irregular 3-group (in this context, irregular has nothing to do with the action). The base group \\(C_3^4\\) allows permuting the three boxes in each row cyclically. The top factor \\(C_3\\) permutes the three rows as sets. God's number is 6.",

    "The wreath product \\(S_3\\wr S_3\\) of order \\((3!)^4=1296\\) is the universal imprimitive permutation group of degree 9. This means that every other transitive imprimitive group embeds into \\(S_3\\wr S_3\\). It realizes all permutations of the three rows as sets. God's number is 13.",

    "The affine general linear group \\(\\mathrm{AGL}(1,9)\\cong C_3^2\\rtimes C_8\\) of order 72 is an extension of the regular group \\(C_3^2\\), realized as 1-dimensional \\(\\mathbb{F}_9\\)-vectorspace, by its automorphism group \\(\\mathrm{GL}(1,9)\\cong C_8\\). It is one of two sharply 2-transitive groups. In particular, it is a Frobenius group. God's number is 6.",

    "The affine semilinear group \\(\\mathrm{A\\Gamma L}(1,9)\\cong C_3^2\\rtimes D_{16}\\) of order 144 is an extension of \\(\\mathrm{AGL}(1,9)\\) by the group of Frobenius automorphisms \\(\\mathrm{Aut}(\\mathbb{F}_3^2)\\cong C_2\\) (note that \\(D_{16}\\cong C_8\\rtimes C_2\\)). God's number is 9.",

    "The Mathieu group \\(M_9\\cong C_3^2\\rtimes Q_8\\) of order 72 is another sharply 2-transitiv extension of the regular group \\(C_3^2\\). It can be described as the derived subgroup of \\(\\mathrm{ASL}(2,3)\\) or as a stabilizer of the larger Mathieu group \\(M_{10}\\cong A_6.C_2\\), which in turn is a stabilizer of the smallest sporadic simple group \\(M_{11}\\). God's number is 5.",

    "The affine special linear group \\(\\mathrm{ASL}(2,3)\\cong C_3^2\\rtimes\\mathrm{SL}(2,3)\\) of order \\(9\\cdot 24=216\\) is an extension of the 2-dimensional \\(\\mathbb{F}_3\\)-vectorspace with the special linear group \\(\\mathrm{SL}(2,3)\\) acting by matrix-vector-multiplication. It is the derived group of \\(\\mathrm{AGL}(2,3)\\). God's number is 8.",

    "The group \\(\\mathrm{AGL}(2,3)\\cong C_3^2\\rtimes\\mathrm{GL}(2,3)\\) of order 432 is the universal solvable primitive group of degree 9 in the sense that every solvable primitive group embeds into \\(\\mathrm{AGL}(2,3).\\) God's number is 10.",

    "The simple group \\(\\mathrm{SL}(2,8)\\) of order 504 acts sharply 3-transitively on the set of the nine 1-dimensional subspaces of \\(\\mathbb{F}_3^2\\) by matrix-vector-multiplication. Every non-trivial element fixes at most two boxes. God's number is 12.",

    "The special semilinear group \\(\\mathrm{\\Sigma L}(2,8)\\) of order 1512 is an extension of \\(\\mathrm{SL}(2,8)\\) by Frobenius automorphisms \\(\\mathrm{Aut}(\\mathbb{F}_8)\\cong C_3\\). God's number is 20 (just as for the Rubik's cube).",

    "The alternating group \\(A_9\\) consists of the \\(9!/2=181{,}440\\) even permutations. It belongs to an infinite family of simple groups. God's number is 21. There is a exactly one scramble, which requires 21 moves. Find it!",

    "The full symmetric group \\(S_9\\) contains all \\(9!=362{,}880\\) permutations. Despite its size, there is a straight-forward algorithm to solve this puzzle. God's number is 37, and there is a unique scramble requiring 37 moves to solve.",

    "The semidirect product \\(C_2^8\\rtimes S_9\\) of order \\[2^8\\cdot 9!=92{,}897{,}280\\] introduces rotations of invidual boxes. Each box can be rotated by \\(\\pi\\), but the sum of all box rotations must add up to 0 (modulo \\(2\\pi\\)). This is exactly the Coxeter group of Dynkin type \\(\\textup{D}_9\\). The base group \\(C_2^8\\) consists of those configurations where all boxes are at the right spot. To distinguish rotated boxes from one another, the background image cannot have any symmetries. A first step to solve this puzzle is to find a move sequence that rotates boxes, but does not permute them.",

    "The wreath product \\(C_2\\wr S_9\\) of order \\[2^9\\cdot 9!=185{,}794{,}560\\] allows rotating all boxes by \\(\\pi\\) independently. This is the Coxeter group of Dynkin type \\(\\textup{B}_9\\).",

    "The wreath product \\(D_8\\wr S_9\\) of order \\[8^9\\cdot 9!=48{,}704{,}929{,}136{,}640\\] realizes all eight symmetries of each of the nine boxes. This is the largest permutation group in our list, but still one million times smaller than the group of the Rubik's cube. It is also the only group in our list that requires three generators. So, the combination button is not available. A strategy to solve this puzzle is to eliminate first the reflections, then the rotations, and finally the permutation of the boxes. Make use of the keyboard (see instructions).",

    "The random permutations for the two buttons are constructed by the <a href='https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle' target='_blank'>Fisher-Yates algorithm</a>. The probability that these two permutations generate \\(A_9\\) or \\(S_9\\) is ca. 0.86 (they generate \\(S_9\\) with \\(\\frac{3}{4}\\cdot 0.86\\approx 0.65\\) probability). In fact, a theorem of Dixon states that the probability that two uniformly randomly chosen permutations generate \\(A_n\\) or \\(S_n\\) turns to 1 with \\(n\\to\\infty\\) (see <a href='https://link.springer.com/article/10.1007/s00493-017-3629-5' target='_blank'>here</a> for more recent results).",

    "I have no idea which generators you chose :-) If your group is too small, the scramble button may not scramble at all."
];
