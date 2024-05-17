import { ApplicationStatus, AuthRole } from '@prisma/client';

export const validStatusTransition = (
  prev: ApplicationStatus,
  next: ApplicationStatus,
  role: AuthRole,
): [boolean, boolean] => {
  switch (role) {
    case AuthRole.Provider: {
      const validStatusTransitions = new Map<
        ApplicationStatus,
        Map<ApplicationStatus, boolean>
      >([
        [
          ApplicationStatus.Draft,
          new Map([
            [ApplicationStatus.Pending, true],
            [ApplicationStatus.Deleted, false],
          ]),
        ],
        [
          ApplicationStatus.Pending,
          new Map([
            [ApplicationStatus.Approved, true],
            [ApplicationStatus.Deleted, false],
          ]),
        ],
        [
          ApplicationStatus.Approved,
          new Map([
            [ApplicationStatus.Published, true],
            [ApplicationStatus.Deleted, false],
          ]),
        ],
        [
          ApplicationStatus.Rejected,
          new Map([
            [ApplicationStatus.Approved, true],
            [ApplicationStatus.Deleted, false],
          ]),
        ],
        [
          ApplicationStatus.Published,
          new Map([
            [ApplicationStatus.Suspended, true],
            [ApplicationStatus.Deleted, true],
            [ApplicationStatus.Achieved, true],
          ]),
        ],
        [
          ApplicationStatus.Suspended,
          new Map([
            [ApplicationStatus.Published, true],
            [ApplicationStatus.Deleted, true],
            [ApplicationStatus.Achieved, true],
          ]),
        ],
      ]);

      return [
        (validStatusTransitions.has(prev) &&
          validStatusTransitions.get(prev)?.has(next)) ??
          false,
        validStatusTransitions.get(prev)?.get(next) ?? true,
      ];
    }
    case AuthRole.Admin: {
      const validStatusTransitions = new Map<
        ApplicationStatus,
        Map<ApplicationStatus, boolean>
      >([
        [
          ApplicationStatus.Approved,
          new Map([[ApplicationStatus.Banned, false]]),
        ],
        [
          ApplicationStatus.Rejected,
          new Map([[ApplicationStatus.Banned, false]]),
        ],
        [
          ApplicationStatus.Banned,
          new Map([
            [ApplicationStatus.Approved, false],
            [ApplicationStatus.Rejected, false],
            [ApplicationStatus.Hidden, false],
            [ApplicationStatus.Published, false],
            [ApplicationStatus.Suspended, false],
          ]),
        ],
        [
          ApplicationStatus.Hidden,
          new Map([
            [ApplicationStatus.Banned, false],
            [ApplicationStatus.Published, false],
            [ApplicationStatus.Suspended, false],
          ]),
        ],
        [
          ApplicationStatus.Published,
          new Map([
            [ApplicationStatus.Banned, false],
            [ApplicationStatus.Hidden, false],
          ]),
        ],
        [
          ApplicationStatus.Suspended,
          new Map([
            [ApplicationStatus.Banned, false],
            [ApplicationStatus.Hidden, false],
          ]),
        ],
      ]);

      return [
        (validStatusTransitions.has(prev) &&
          validStatusTransitions.get(prev)?.has(next)) ??
          false,
        validStatusTransitions.get(prev)?.get(next) ?? false,
      ];
    }
    default:
      return [false, true];
  }
};

export const getAvailableStatuses = (
  prev: ApplicationStatus,
  role: AuthRole = AuthRole.Provider,
): ApplicationStatus[] =>
  Object.values(ApplicationStatus).filter(
    (next) => validStatusTransition(prev, next, role)[0],
  );
