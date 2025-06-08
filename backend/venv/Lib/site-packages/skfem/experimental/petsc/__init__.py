import numpy as np
import pymetis
from petsc4py import PETSc
from skfem import MeshTri


class DistributedMesh:

    def __init__(self, path, builder=False):

        comm = PETSc.COMM_WORLD
        self.rank = comm.getRank()
        N = comm.getSize()

        # normalize path
        if path[-1] == '/':
            path = path[:-1]
        self.path = path

        # check if mesh exists, if not build using rank 0
        if self.rank == 0:

            if builder:
                print('Building the mesh...')
                mesh = builder()
                print('Partitioning the mesh...')
                _, _, mship = pymetis.part_mesh(N, mesh.t.T)
                mship = np.array(mship, dtype=np.int32)

                # reorder mesh so that nodes belonging to 0 come first etc.
                ix = np.argsort(mship)
                rix = np.argsort(ix)
                p = mesh.p[:, ix]
                t = rix[mesh.t]
                remesh = type(mesh)(p, t)

                tmship = mship[mesh.t]
                for rank in range(N):
                    print('Saving part {}...'.format(rank))
                    sub = np.nonzero((tmship == rank).all(axis=0))[0]
                    halo = np.nonzero((tmship == rank).any(axis=0))[0]
                    tmp, rmap = (remesh
                                 .with_boundaries({'dir': remesh.boundary_facets()})
                                 .with_subdomains({'sub': sub})
                                 .restrict(halo, return_mapping=True))
                    np.save('{}/petsc_part_{}_p'.format(path, rank), tmp.p)
                    np.save('{}/petsc_part_{}_t'.format(path, rank), tmp.t)
                    np.save('{}/petsc_part_{}_subdomains'.format(path, rank),
                            tmp.subdomains)
                    np.save('{}/petsc_part_{}_boundaries'.format(path, rank),
                            tmp.boundaries)
                    np.save('{}/petsc_part_{}_rmap'.format(path, rank), rmap)

            # check if files exist
            file_exists = True
            try:
                np.load('{}/petsc_part_{}_p.npy'.format(path, self.rank))
            except Exception as e:
                file_exists = False

            if not file_exists:
                raise Exception("files do not exist, give builder=...")

        comm.Barrier()

    def __enter__(self):

        path = self.path
        p = np.load('{}/petsc_part_{}_p.npy'.format(path, self.rank))
        t = np.load('{}/petsc_part_{}_t.npy'.format(path, self.rank))
        subdomains = np.load('{}/petsc_part_{}_subdomains.npy'.format(path, self.rank),
                             allow_pickle=True).item()
        boundaries = np.load('{}/petsc_part_{}_boundaries.npy'.format(path, self.rank),
                             allow_pickle=True).item()

        return MeshTri(p, t, _subdomains=subdomains, _boundaries=boundaries)

    def __exit__(self, type, value, traceback):

        pass
